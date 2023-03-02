<script lang="ts">
  import type { Line } from './Plotter'

  import { onDestroy, onMount } from 'svelte'
  import panzoom, { PanzoomObject, PanzoomOptions } from '@panzoom/panzoom'
  import { colorPalette } from '../../util/color'

  export let lines: Line[] = []
  export let width: number | string = '100%'
  export let height: number | string = '100%'
  export let style = ''
  export let resizeable: 'vertical' | 'horizontal' | 'both' | boolean = false

  let currentWidth: number = 0
  let currentHeight: number = 0

  let smallGridMultiplier = 0.1
  let gridScale = 100
  let gridOpacity = 0.5
  let scale = 1

  $: {
    gridScale = Math.pow(10, -Math.floor(Math.log10(scale))) * 100
  }

  let pan = { x: 0, y: 0 }
  let isPanning = false
  let resizeObserver: ResizeObserver

  const watchResize = (dom_elem: any, callback: any) => {
    const r = new ResizeObserver(() => callback())
    r.observe(dom_elem)
    return r
  }

  let panZoomGroup: SVGGElement
  let containerElmt: HTMLDivElement
  let canvas: PanzoomObject
  let isResizing = false

  const onMouseWheel = (e: WheelEvent) => {
    canvas.setOptions({ ...canvas.getOptions(), disableZoom: isResizing })
    canvas.zoomWithWheel(e)

    scale = canvas.getScale()
    pan = canvas.getPan()

    e.stopPropagation()
    e.preventDefault()
  }

  onMount(() => {
    currentWidth = containerElmt.clientWidth
    currentHeight = containerElmt.clientHeight

    const options: PanzoomOptions = {
      startX: 0,
      startY: currentHeight / 2,
      startScale: 1,
      maxScale: Infinity,
      minScale: 0,
      animate: false,
      step: 0.2,
      cursor: undefined,
      canvas: true,

      handleStartEvent: (e: Event) => {
        isPanning = true
        e.stopPropagation()
        // canvas.setOptions({
        //   ...canvas.getOptions(),
        //   // disablePan: isResizing,
        //   // disableZoom: isResizing,
        // })
      },
      //   isSVG: true
    }

    canvas = panzoom(panZoomGroup, options)
    setTimeout(() => {
      pan = canvas.getPan()
      scale = canvas.getScale()
    })

    resizeObserver = watchResize(containerElmt, () => {
      isResizing = true
      let oldWidth = currentWidth
      let oldHeight = currentHeight
      currentWidth = containerElmt.clientWidth
      currentHeight = containerElmt.clientHeight
      const {
        x,
        y,
        scale: s,
      } = canvas.pan(
        pan.x + (currentWidth - oldWidth) / scale / 2,
        pan.y + (currentHeight - oldHeight) / scale / 2
      )
      pan = { x, y }
      scale = s
    })
  })

  onDestroy(() => {
    resizeObserver.disconnect()
  })
</script>

<svelte:window
  on:mousemove={() => {
    if (isPanning) {
      pan = canvas.getPan()
    }
  }}
  on:mouseup={() => {
    isPanning = false
    isResizing = false
  }}
/>

<container
  style="width: {width}{typeof width == 'number' ? 'px' : ''}; height: {height}{typeof height ==
  'number'
    ? 'px'
    : ''}; resize: {resizeable === true ? 'both' : resizeable}; {style}"
  bind:this={containerElmt}
  on:wheel={onMouseWheel}
>
  <!-- <TextBlock variant="caption">plotter</TextBlock> -->
  <!-- <TextBox value="Default value" /> -->

  <!-- <Svrollbar /> -->

  <svg width="{100}%" height="{100}%">
    <defs>
      <pattern
        id="smallGrid"
        width={gridScale * smallGridMultiplier}
        height={gridScale * smallGridMultiplier}
        patternUnits="userSpaceOnUse"
      >
        <path
          d="M {gridScale * smallGridMultiplier} 0 L 0 0 0 {gridScale * smallGridMultiplier}"
          fill="none"
          stroke="gray"
          stroke-width={0.5 / scale}
        />
      </pattern>

      <pattern id="grid" width={gridScale} height={gridScale} patternUnits="userSpaceOnUse">
        <rect
          width={gridScale}
          height={gridScale}
          fill="url(#smallGrid)"
          vector-effect="non-scaling-stroke"
        />
        <path
          d="M {gridScale} 0 L 0 0 0 {gridScale}"
          fill="none"
          stroke="gray"
          stroke-width={1 / scale}
        />
      </pattern>
    </defs>

    <g bind:this={panZoomGroup}>
      <g>
        <rect
          width={currentWidth / scale}
          height={currentHeight / scale}
          x={-pan.x}
          y={-pan.y}
          fill="url(#grid)"
          opacity={gridOpacity}
        />
      </g>

      <g>
        <path
          d="M {-pan.x} 0 L {-pan.x + currentWidth / scale} 0"
          fill="none"
          stroke="gray"
          stroke-width={1.5 / scale}
        />
        <path
          d="M 0 {-pan.y} L 0 {-pan.y + currentHeight / scale}"
          fill="none"
          stroke="gray"
          stroke-width={1.5 / scale}
        />
      </g>

      <g>
        {#each lines as line, i}
          <path
            d={line.points
              .map((point, i) => {
                return `${i === 0 ? 'M' : 'L'} ${point.x} ${point.y}`
              })
              .join(' ')}
            fill="none"
            stroke={line.color ?? colorPalette[(i * 130) % colorPalette.length]}
            stroke-width="1"
            vector-effect="non-scaling-stroke"
          />
          <!-- {#each line.points as point}
          <circle
            class="point-container"
            cx={point.x}
            cy={point.y}
            r="2"
            fill={line.color ?? colorPalette[(i * 130) % colorPalette.length]}
            stroke="transparent"
            stroke-width="20"
          />
        {/each} -->
        {/each}
      </g>
    </g>
  </svg>
</container>

<style lang="scss">
  container {
    align-items: center;
    // background-clip: padding-box;
    background-color: var(--dark);
    border: 1px solid var(--border-color);
    border-radius: 6px;
    display: flex;
    position: relative;

    overflow: hidden;

    max-width: 100%;
    min-width: 100px;
    min-height: 100px;
  }

  // circle.point-container {
  //   &:hover {
  //     r: 4;
  //   }
  // }

  // point {
  //   width: 5px;
  //   height: 5px;
  //   background-color: red;
  //   position: absolute;
  //   border-radius: 50%;
  // }
</style>
