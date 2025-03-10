<template>
  <div v-if="isTxTypeAllow" id="create-transaction">
    <TransactionHash id="transaction-hash" v-if="transactionInProgress" />
    <CustomButton
      v-if="!transactionConfirmed"
      id="transaction-button"
      @click="gameOverAction"
      :type="web3Disconnected || transactionInProgress ? 'disable' : 'dark'"
      :slim="true"
    >
      {{ transactionInProgress ? txInProgressText : txActionText }}
    </CustomButton>
    <a
      v-if="transactionConfirmed"
      id="marketplace-button"
      :href="marketplaceUrl"
    >
      <CustomButton :type="web3Disconnected ? 'disable' : 'dark'" :slim="true">
        Check on {{ marketplaceName }}
      </CustomButton>
    </a>
  </div>
</template>

<script lang="ts">
import { useLocalStore } from '@/stores/local'
import { useGameStore } from '@/stores/game'
import { useModalStore } from '@/stores/modal'
import { ModalKey, TxType } from '@/types'
import { useWeb3 } from '@/composables/useWeb3'
import {
  POLLER_MILLISECONDS,
  NETWORKS,
  CURRENT_NETWORK,
  ERC721_ADDRESS,
  ERC721_TOKEN_ID,
  TX_ACTION_COPY,
  TX_ACTION_PROGRESS_COPY,
} from '@/constants.js'
import { onMounted, onBeforeUnmount, computed, watch, type PropType } from 'vue'
export default {
  props: {
    txType: {
      type: String as PropType<TxType>,
      required: true,
    },
  },
  setup(props) {
    let txConfirmationStatusPoller: any

    const localStore = useLocalStore()
    const modalStore = useModalStore()
    const gameStore = useGameStore()
    const web3WittyPixels = useWeb3()

    onMounted(() => {
      if (txHash.value && !transactionConfirmed.value) {
        setTxConfirmationsPoller()
      }
    })
    onBeforeUnmount(() => {
      clearTxConfirmationPoller()
    })

    const transactionError = computed(() => gameStore.errors.transaction)
    const transactionInProgress = computed(
      () =>
        localStore.txInfo?.txHash &&
        !transactionConfirmed.value &&
        !transactionError.value
    )
    const transactionConfirmed = computed(
      () =>
        localStore.txInfo?.txConfirmation ||
        localStore.txInfo?.externalConfirmation
    )
    const web3Disconnected = computed(() => gameStore.errors.web3Disconnected)
    const web3WrongNetwork = computed(() => gameStore.errors.web3WrongNetwork)
    const isTxTypeAllow = computed(() => {
      return localStore.txInfo?.txType === props.txType
    })
    const txActionText = computed(() => TX_ACTION_COPY[props.txType])
    const txInProgressText = computed(
      () => TX_ACTION_PROGRESS_COPY[props.txType]
    )
    const marketplaceUrl = computed(
      () =>
        `${NETWORKS[CURRENT_NETWORK].marketplace}/${ERC721_ADDRESS}/${ERC721_TOKEN_ID}`
    )
    const txHash = computed(() => localStore.txInfo?.txHash)
    const marketplaceName = computed(() => NETWORKS[CURRENT_NETWORK])

    watch(txHash, value => {
      clearInterval(txConfirmationStatusPoller)
      if (value && !transactionConfirmed.value) {
        setTxConfirmationsPoller()
      }
    })
    watch(transactionConfirmed, value => {
      if (value) {
        modalStore.openModal(ModalKey.txConfirmation)
      }
    })
    watch(transactionError, value => {
      if (value) {
        modalStore.openModal(ModalKey.txError)
      }
    })
    function setTxConfirmationsPoller() {
      txConfirmationStatusPoller = setInterval(async () => {
        await web3WittyPixels.checkTransactionStatus()
      }, POLLER_MILLISECONDS)
    }
    function clearTxConfirmationPoller() {
      clearInterval(txConfirmationStatusPoller)
      txConfirmationStatusPoller = null
    }
    function gameOverAction() {
      if (props.txType == TxType.Redeem) {
        web3WittyPixels.redeemOwnership()
      } else if (props.txType == TxType.Buy) {
        web3WittyPixels.buyNFT()
      } else if (props.txType == TxType.Withdraw) {
        web3WittyPixels.withdrawNFTOwnership()
      }
    }
    return {
      gameOverAction,
      gameStore,
      web3Disconnected,
      web3WrongNetwork,
      transactionConfirmed,
      transactionInProgress,
      isTxTypeAllow,
      txActionText,
      txInProgressText,
      marketplaceUrl,
      marketplaceName,
    }
  },
}
</script>
