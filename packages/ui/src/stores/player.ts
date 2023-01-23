import { defineStore } from 'pinia'
import { ApiService } from '@/api'
import router from '../router'
import {
  type Pixel,
  type PalettePoints,
  type PixelDB,
  type Errors,
  type InteractionInfo,
  ErrorKey,
} from '@/types'
import { COLORS, PIXEL_SIZE, COLOR_FROM_HEX } from '@/constants'
import { useLocalStore } from './local'
export const useStore = defineStore('player', {
  state: () => {
    return {
      api: new ApiService(),
      localStore: useLocalStore(),
      id: null,
      username: '',
      score: null,
      color: 0 as number,
      bonus: null,
      interactionInfo: null,
      interactionIn: null as InteractionInfo | null,
      interactionOut: null as InteractionInfo | null,
      history: [],
      playersGlobalStats: [],
      errors: {} as Errors,
      selectedColor: null as string | null,
      palettePoints: {} as PalettePoints,
      showPalettePanel: false as boolean,
      pixelToPaint: null as Pixel | null,
      pixelMap: [] as Array<Array<PixelDB>>,
      checkpoint: 0,
    }
  },
  actions: {
    async getPixelMap() {
      const tokenInfo = this.localStore.getToken()
      const request = await this.api.getCanvas({
        checkpoint: this.checkpoint,
        token: tokenInfo.token,
      })
      if (request.error) {
        this.setError(ErrorKey.canvas, request.error)
      } else {
        this.pixelMap = request.canvas.pixels
        this.checkpoint = request.checkpoint
        this.clearError(ErrorKey.canvas)
      }
    },
    async paintPixel() {
      if (this.pixelToPaint && this.selectedColor) {
        const tokenInfo = this.localStore.getToken()
        const request = await this.api.drawPixel({
          x: this.pixelToPaint.x / PIXEL_SIZE,
          y: this.pixelToPaint.y / PIXEL_SIZE,
          color: COLOR_FROM_HEX[this.pixelToPaint.fill],
          token: tokenInfo.token,
        })
        console.log('paint pixel!!', request)
        if (request.error) {
          this.setError(ErrorKey.paint, request.error)
        } else {
          this.pixelMap[request.x][request.y] = request
          console.log('updatedPixel', this.pixelMap[request.x][request.y])
          this.clearError(ErrorKey.paint)
        }
      }
    },
    setPixelToPaint(pixel: Pixel) {
      const pixelFromMap = this.pixelMap[pixel.x / PIXEL_SIZE]
        ? this.pixelMap[pixel.x / PIXEL_SIZE][pixel.y / PIXEL_SIZE]
        : null
      if (this.pixelMap && pixelFromMap?.o) {
        if (this.pixelMap) {
          this.pixelToPaint = {
            ...pixel,
            author: pixelFromMap?.o,
            fill: COLORS[pixelFromMap.c],
          }
        }
      } else {
        this.pixelToPaint = pixel
      }
    },
    clearPixelToPaint() {
      this.pixelToPaint = null
      this.selectedColor = null
    },
    togglePalettePanel(value: boolean) {
      this.showPalettePanel = value
    },
    selectColor(color: string) {
      this.selectedColor = color
      if (this.pixelToPaint) {
        this.pixelToPaint.fill = color
      }
    },
    notify(payload: any) {
      const app = (this as any).app
      app.config.globalProperties.$notify(payload)
    },
    // TODO: set NFT preview data
    setPreviewData(preview: any) {
      console.log(preview)
    },
    // Errors
    clearError(error: ErrorKey) {
      this.errors[error] = null
    },
    setError(name: ErrorKey, error: any) {
      this.errors[name] = error.response?.data?.message || error.toString()
      this.notify({ message: this.errors[name] })
    },

    async authorize({ key }: any) {
      const request = await this.api.authorize({ key })
      if (request.error) {
        router.push('/init-game')
        this.setError(ErrorKey.auth, request.error)
      } else if (request.token) {
        await this.localStore.saveTokenInfo(request)
        this.clearError(ErrorKey.auth)
        await this.getPlayerInfo()
        await this.getGlobalStats()
        router.push(`/settings/${key}`)
      }
    },
    async interact({ key }: any) {
      const tokenInfo = this.localStore.getToken()
      const request = await this.api.interact({
        token: tokenInfo.token,
        to: key,
      })

      if (request.error) {
        this.setError(ErrorKey.interaction, request.error)
        router.push('/init-game')
      } else {
        this.clearError(ErrorKey.interaction)
        this.interactionInfo = request
        router.push('/init-game')
        this.getPlayerInfo()
      }
    },
    // History
    async getInteractionHistory(offset = 0, limit = 25) {
      const tokenInfo = this.localStore.getToken()
      const request = await this.api.getInteractionHistory({
        token: tokenInfo && tokenInfo.token,
        id: tokenInfo && tokenInfo.key,
        offset,
        limit,
      })
      if (request.error) {
        router.push('/init-game')
        this.setError(ErrorKey.history, request.error)
      } else {
        this.clearError(ErrorKey.history)
        return {
          result: request.interactions?.interactions,
          total: request.interactions?.total,
        }
      }
    },
    // Leaderboard
    async getGlobalStats(offset = 0, limit = 25) {
      await this.getPlayerInfo()
      const request = await this.api.getLeaderboardInfo({
        offset,
        limit,
      })
      if (request.error) {
        this.setError(ErrorKey.getLeaderboardInfo, request.error)
      } else {
        console.log('leaderboard', request.players.players)
        this.clearError(ErrorKey.getLeaderboardInfo)
        return {
          result: request.players.players,
          total: request.players.total,
        }
      }
    },
    // Player Info
    async getPlayerInfo() {
      const tokenInfo = this.localStore.getToken()
      const request = await this.api.getInfo({
        token: tokenInfo && tokenInfo.token,
        id: tokenInfo && tokenInfo.key,
      })
      if (request.error) {
        router.push({ name: 'init-game' })
        this.setError(ErrorKey.info, request.error)
      } else {
        this.clearError(ErrorKey.info)
        const { key, username, score, color, palette } = request.player
        console.log(request)
        this.id = key
        this.username = username
        this.score = score
        this.palettePoints = palette
        this.color = color
        if (request.lastInteractionIn) {
          this.interactionIn = request.lastInteractionIn
        }
        if (request.lastInteractionOut) {
          this.interactionOut = request.lastInteractionOut
        }
      }
    },
  },
})
