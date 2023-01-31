import {
  type ColorsFromIndex,
  type ColorFromHex,
  type NetworkMap,
  ColorHexMap,
} from '@/types'

export const CONTRACT_ADDRESS =
  import.meta.env.VITE_CONTRACT_ADDRESS ||
  '0xE41D6D1cFe55A0fc2035dD663D873D15f21d93c2'

export const OPENSEA_BASE_URL =
  import.meta.env.VITE_OPENSEA_BASE_URL ||
  'https://opensea.io/assets/0x855BCa56D00F3f550D0c610BBF562FEBF6540bc6'

export const EXPLORER_BASE_URL =
  import.meta.env.VITE_EXPLORER_BASE_URL || 'https://polygonscan.com/tx/'

export const NETWORKS: NetworkMap = {
  137: {
    name: 'Polygon Mainnet',
    id: 137,
    contractAddress:
      import.meta.env.VITE_POLYGON_MAINNET_CONTRACT_ADDRESS || '0x00',
    rpcUrls: ['https://polygon-rpc.com'],
  },
  1030: {
    name: 'Conflux eSpace Mainnet',
    id: 1030,
  },
  25: {
    name: 'Cronos Mainnet',
    id: 25,
  },
  321: {
    name: 'KCC Mainnet',
    id: 321,
  },
  1: {
    name: 'Ethereum Mainnet',
    id: 1,
  },
  82: {
    name: 'Meter Mainnet',
    id: 82,
  },
  1088: {
    name: 'Metis Mainnet',
    id: 1088,
  },
  66: {
    name: 'OKXChain Mainnet',
    id: 66,
  },
  71: {
    name: 'Conflux eSpace Testnet',
    id: 71,
  },
  338: {
    name: 'Cronos Testnet',
    id: 338,
  },
  322: {
    name: 'KCC Testnet',
    id: 322,
  },
  5: {
    name: 'Ethereum Goerli',
    id: 5,
  },
  83: {
    name: 'Meter Testnet',
    id: 83,
  },
  588: {
    name: 'Metis Stardust Testnet',
    id: 588,
  },
  65: {
    name: 'OKXChain Testnet',
    id: 65,
  },
  80001: {
    name: 'Polygon Mumbai',
    id: 80001,
  },
}

export const CURRENT_NETWORK = 137

export const VITE_TEST = import.meta.env.VITE_TEST || false

export const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || 'http://0.0.0.0:4000'

export const BASE_URL =
  import.meta.env.VITE_BASE_URL || 'https://wittypixels.com'

export const ATTRIBUTES = {}

export const COLORS: ColorsFromIndex = {
  0: ColorHexMap.white,
  1: ColorHexMap.black,
  2: ColorHexMap.orange,
  3: ColorHexMap.yellow,
  4: ColorHexMap.green,
  5: ColorHexMap.blue,
  6: ColorHexMap.red,
  7: ColorHexMap.purple,
}
export const COLOR_FROM_HEX: ColorFromHex = {
  [ColorHexMap.white]: 0,
  [ColorHexMap.black]: 1,
  [ColorHexMap.orange]: 2,
  [ColorHexMap.yellow]: 3,
  [ColorHexMap.green]: 4,
  [ColorHexMap.blue]: 5,
  [ColorHexMap.red]: 6,
  [ColorHexMap.purple]: 7,
}
export const TIMEZONE = 'America/Denver'
export const PIXEL_SIZE = 16
export const CANVAS_WIDTH = 1000
export const CANVAS_HEIGHT = 1000
export const SCALE_BY = 1.01

export const POLLER_MILLISECONDS = import.meta.env.VITE_POLLER_MILLISECONDS
  ? parseInt(import.meta.env.VITE_POLLER_MILLISECONDS)
  : 5000

export const TIME_TO_REDEEM_MILLISECONDS = import.meta.env
  .VITE_TIME_TO_REDEEM_MILLISECONDS
  ? parseInt(import.meta.env.VITE_TIME_TO_REDEEM_MILLISECONDS)
  : 60000

export const GAME_ENDS_TIMESTAMP = new Date().getTime() + 6000

// export const GAME_ENDS_TIMESTAMP = import.meta.env.VITE_GAME_ENDS_TIMESTAMP
//   ? parseInt(import.meta.env.VITE_GAME_ENDS_TIMESTAMP)
//   : 1677891600000 // Fri, 3 March 2023 18:00 GMT-7,

export const PLAYER_MAINNET_TIMESTAMP = import.meta.env.PLAYER_MAINNET_TIMESTAMP
  ? parseInt(import.meta.env.VITE_PLAYER_MAINNET_TIMESTAMP)
  : 1677218400000 // Thu, 24 February 2023 0:00 GMT-7
