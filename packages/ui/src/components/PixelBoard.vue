<template>
  <div class="pixel-board" ref="targetBoard">
    <LoadingSpinner v-if="!pixelMap[0]?.length" />
    <div id="canvas-container"></div>
  </div>
</template>

<script lang="ts">
import { ref, computed, onMounted, onBeforeUnmount, watch } from 'vue'
import { useStore } from '@/stores/player'
import { type Coordinates, type GeneratePixelArgs, ColorHexMap } from '@/types'
import { PIXEL_SIZE, SCALE_BY, COLORS, POLLER_MILLISECONDS } from '@/constants'
import Konva from 'konva'

export default {
  setup() {
    const store = useStore()
    let pixelMapPoller: any = null
    const targetBoard = ref()
    const group1 = new Konva.Group()
    const group2 = new Konva.Group()
    const stage = ref()
    const layer = new Konva.Layer()
    const selectedPixel = new Konva.Rect({
      id: generateId({ x: 0, y: 0 }),
      author: null,
      timestamp: null,
      x: 0,
      y: 0,
      width: PIXEL_SIZE,
      height: PIXEL_SIZE,
      fill: ColorHexMap.white,
      strokeWidth: 1,
      stroke: ColorHexMap.lightgrey,
    })

    onMounted(async () => {
      pixelMapPoller = setInterval(async () => {
        await store.getPixelMap()
      }, POLLER_MILLISECONDS)
      console.log('stage width', targetBoard.value.clientWidth)
      console.log('stage height', targetBoard.value.clientHeight)
      stage.value = new Konva.Stage({
        container: 'canvas-container',
        width: targetBoard.value.clientWidth,
        height: targetBoard.value.clientHeight,
        draggable: true,
        pixelRatio: 1,
      })
      // stage.value.on('wheel', (e: any) => zoom(e))
      stage.value.on('dragstart', () => {
        stage.value.style.cursor = 'move'
      })
      stage.value.on('dragend', () => {
        stage.value.style.cursor = 'pointer'
      })
      if (pixelMap.value[0]?.length) {
        drawGrid()
      }
    })
    onBeforeUnmount(() => {
      clearInterval(pixelMapPoller)
    })
    const selectedColor = computed(() => {
      return store.selectedColor
    })
    const pixelToPaint = computed(() => {
      return store.pixelToPaint
    })
    const authorizedPlayer = computed(() => {
      return store.username
    })
    const pixelMap = computed(() => {
      return store.pixelMap
    })
    const pixelList = computed(() => {
      return pixelMap.value.flat()
    })
    const isPanelClosed = computed(() => {
      return !store.showPalettePanel
    })
    function generateId({ x, y }: Coordinates): string {
      return `${x}:${y}`
    }
    function standardizeToCanvasPixel({
      x,
      y,
      color,
      strokeColor = color,
    }: GeneratePixelArgs) {
      return {
        id: generateId({ x: x, y: y }),
        author: null,
        timestamp: null,
        x: x,
        y: y,
        width: PIXEL_SIZE,
        height: PIXEL_SIZE,
        fill: color,
        strokeWidth: 1,
        stroke: strokeColor,
      }
    }
    const generatePixel = ({
      x,
      y,
      color,
      strokeColor = color,
    }: GeneratePixelArgs) => {
      const pixel = new Konva.Rect(
        standardizeToCanvasPixel({ x, y, color, strokeColor })
      )
      pixel.perfectDrawEnabled(false)
      pixel.shadowForStrokeEnabled(false)
      pixel.on('click tap', pixel => {
        if (selectedColor.value) {
          selectedPixel.attrs.fill = COLORS[selectedColor.value]
        } else if (pixel.target.attrs.fill !== ColorHexMap.white) {
          selectedPixel.attrs.fill = pixel.target.attrs.fill
        } else {
          selectedPixel.attrs.fill = ColorHexMap.white
        }
        if (!pixelToPaint.value) {
          selectedPixel.attrs.stroke = ColorHexMap.black
        }
        selectedPixel.position({
          x: pixel.target.attrs.x,
          y: pixel.target.attrs.y,
        })
        layer.batchDraw()
        if (authorizedPlayer.value) {
          showPanel()
          previewPixel({ x, y })
        }
      })
      group1.add(pixel)
    }
    function showPanel() {
      store.togglePalettePanel(true)
    }
    function previewPixel({ x, y }: Coordinates) {
      if (
        !pixelToPaint.value ||
        generateId({ x: pixelToPaint.value.x, y: pixelToPaint.value.y }) !==
          generateId({ x, y })
      ) {
        store.setPixelToPaint({
          x: CanvasCoordinateToDBCoordinate(x),
          y: CanvasCoordinateToDBCoordinate(y),
          c: selectedColor.value ?? 0,
        })
      }
      targetBoard.value.style.cursor = 'pointer'
    }
    function zoom(e: any) {
      e.evt.preventDefault()
      // Scale
      let direction = e.evt.deltaY > 0 ? 1 : -1
      const pointerPosition = stage.value.getPointerPosition()
      const prevScale = stage.value.scaleX()
      const nextScale =
        direction > 0 ? prevScale * SCALE_BY : prevScale / SCALE_BY
      const mousePointTo = {
        x: (pointerPosition.x - stage.value.x()) / prevScale,
        y: (pointerPosition.y - stage.value.y()) / prevScale,
      }
      const newPos = {
        x: pointerPosition.x - mousePointTo.x * nextScale,
        y: pointerPosition.y - mousePointTo.y * nextScale,
      }
      // Zoom on trackpad
      if (e.evt.ctrlKey) direction = -direction
      stage.value.scale({ x: nextScale, y: nextScale })
      stage.value.position(newPos)
      stage.value.batchDraw()
    }
    function batchDrawGrid() {
      group1.removeChildren()
      pixelList.value.map(pixel => {
        generatePixel({
          x: DBCoordinateToCanvasCoordinate(pixel.x),
          y: DBCoordinateToCanvasCoordinate(pixel.y),
          color: COLORS[pixel.c],
          strokeColor: pixel.o ? COLORS[pixel.c] : ColorHexMap.lightgrey,
        })
      })
      layer.batchDraw()
    }
    function drawGrid() {
      group2.add(selectedPixel)
      console.log('pixelList', pixelList.value)
      pixelList.value.map(pixel => {
        generatePixel({
          x: DBCoordinateToCanvasCoordinate(pixel.x),
          y: DBCoordinateToCanvasCoordinate(pixel.y),
          color: COLORS[pixel.c],
          strokeColor: pixel.o ? COLORS[pixel.c] : ColorHexMap.lightgrey,
        })
      })
      layer.add(group1)
      layer.add(group2)
      stage.value.add(layer)
    }
    function setSelectedPixelToDefault() {
      selectedPixel.attrs.fill = ColorHexMap.white
      selectedPixel.attrs.stroke = ColorHexMap.lightgrey
      layer.batchDraw()
    }
    function CanvasCoordinateToDBCoordinate(coordinate: number) {
      return coordinate / PIXEL_SIZE
    }
    function DBCoordinateToCanvasCoordinate(coordinate: number) {
      return coordinate * PIXEL_SIZE
    }
    watch(pixelMap, () => {
      drawGrid()
    })
    watch(selectedColor, value => {
      if (value) {
        selectedPixel.attrs.fill = COLORS[value]
        layer.batchDraw()
      } else {
        setSelectedPixelToDefault()
      }
    })
    watch(isPanelClosed, isClosed => {
      if (isClosed) {
        setSelectedPixelToDefault()
      }
    })
    watch(pixelList, () => {
      batchDrawGrid()
    })
    return {
      stage,
      targetBoard,
      pixelMap,
    }
  },
}
</script>
<style>
.pixel-board {
  max-width: 100%;
  height: 100%;
  max-height: 90vh;
  overflow: hidden;
}
</style>
