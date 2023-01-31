/* eslint-disable no-unused-vars */
export type Pixel = {
  id: string
  author: string | null
  timestamp: number | null
  x: number
  y: number
  width: number
  height: number
  fill: string
  strokeWidth: number | null
  stroke: string
}
export type PixelDB = {
  x: number
  y: number
  c: number
  o: string
  t: number
}
export type Provider = {
  network: string
  address: string
}
export enum ColorHexMap {
  white = 'white',
  black = 'black',
  red = '#EA033A',
  orange = '#FF5730',
  yellow = '#F5EA0A',
  green = '#56C553',
  blue = '#5C96FF',
  purple = '#8D52FF',
}
export type GeneratePixelArgs = {
  x: number
  y: number
  color: string
  strokeColor?: string
}
export enum Position {
  right = 'right',
  left = 'left',
}
export enum ModalKey {
  mint = 'mint',
  export = 'export',
  preview = 'preview',
  gameOver = 'gameOver',
  redeem = 'redeem',
}
export interface Modals {
  [key: string]: boolean | null
}
export type Coordinates = {
  x: number
  y: number
}
export interface ColorsFromIndex {
  [key: number]: string
}
export interface NetworkMap {
  [key: number]: {
    name: string
    id: number
    contractAddress?: string
    rpcUrls?: Array<string>
  }
}
export interface ColorFromHex {
  [key: string]: number
}
export interface PalettePoints {
  [key: number]: number
}
export interface PixelMap {
  [key: string]: Pixel
}
export type MintInfo = {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  events: Array<any>
  blockHash: string
  mintConfirmation: boolean
  txHash: string
}
export enum TokenStatus {
  Void = 'void',
  Launching = 'launching',
  Minting = 'minting',
  Fractionalized = 'fractionalized',
}
export enum ErrorKey {
  preview = 'preview',
  auth = 'auth',
  interaction = 'interaction',
  info = 'info',
  history = 'history',
  getLeaderboardInfo = 'getLeaderboardInfo',
  network = 'network',
  getContractArgs = 'getContractArgs',
  redeem = 'redeem',
  canvas = 'canvas',
  paint = 'paint',
}
export enum InteractionType {
  interactionOut = 'interactionOut',
  interactionIn = 'interactionIn',
}
export type InteractionInfo = {
  ends: number
}
export enum GameOverErrorKey {
  redeem = 'redeem',
  web3WrongNetwork = 'web3WrongNetwork',
  web3Disconnected = 'web3Disconnected',
  web3ErrorSwitchingNetworks = 'web3ErrorSwitchingNetworks',
}
export interface Errors {
  [key: string]: string | null
}
