<script lang="ts">
  import { parseColor, rgb2hsv } from '../../util/color'
  // import { formatColorString } from 'xel/utils/color.js'

  export let color: string | null = null
  export let value: string | null = null
  export let togglable = false
  export let toggled = color !== null && togglable !== true
  export let mixed = false
  export let disabled = false
  export let condensed = false
  export let skin: 'flat' | 'recessed' | 'nav' | 'dock' | 'circular' | null = null
  export let size: 'small' | 'medium' | 'large' | 'smaller' | 'larger' | null = null
  export let style: string = ''
  let cssClass: string = ''
  export { cssClass as class }

  let useLightTextColor = true

  // --preset-accent-colors: blue #3584e4,purple #9141ac,pink #f74f9e,red #e01b24,orange #ff7800,yellow #e5a50a,green #2ec27e,graphite #9a9996;

  let colorHSLA: string | null = null
  let colorHSLAValues: number[] | null = null
  $: {
    if (color?.startsWith('--')) {
      color = getComputedStyle(document.body).getPropertyValue(color)
    }

    if (color == 'transparent') {
      colorHSLA = "hsla(0, 0%, 0%, 0)"
    } else {
      colorHSLA = color; // ? formatColorString(color, 'hsla')! : null
    }

    colorHSLAValues = colorHSLA ? colorHSLA.match(/(\d+\.?\d*)/g)!.map((n) => parseFloat(n)) : null

    if (colorHSLAValues && colorHSLAValues[2] > 54) {
      useLightTextColor = false
    }
  }

  export const computedSize: 'small' | 'medium' | 'large' = 'medium'
  export const expanded = false
  export const expandable = false
  export const ownerButtons: any = null

  // {computedSize}
  // {expanded}
  // {expandable}
  // {ownerButtons}

  function onClick() {
    if (togglable) {
      toggled = !toggled
    }
  }
</script>

<x-button
  {value}
  {toggled}
  {togglable}
  {mixed}
  {disabled}
  {condensed}
  {skin}
  {size}
  on:click
  on:click={onClick}
  on:mousedown
  on:mouseup
  on:mouseenter
  on:mouseleave
  on:keypress
  class={cssClass}
  style="{color
    ? `
    --accent-color: ${colorHSLA}; 
    --accent-color-h: ${colorHSLAValues?.[0]}; 
    --accent-color-s: ${colorHSLAValues?.[1]}%;
    --accent-color-l: ${colorHSLAValues?.[2]}%; 
    --accent-color-a: ${colorHSLAValues?.[3]};
    
    color: ${useLightTextColor ? 'var(--light)' : 'var(--dark)'};
    `
    : ''} {style}"
>
  <slot />
</x-button>

<style lang="scss">
  * {
    cursor: default !important;
  }

  x-button {
    --light-accent-color: hsla(
      var(--accent-color-h),
      var(--accent-color-s),
      calc(var(--accent-color-l) + 12%),
      var(--accent-color-a)
    );
    --lightest-accent-color: hsla(
      var(--accent-color-h),
      var(--accent-color-s),
      calc(var(--accent-color-l) + 20%),
      var(--accent-color-a)
    );
    --dark-accent-color: hsla(
      var(--accent-color-h),
      var(--accent-color-s),
      calc(var(--accent-color-l) - 5%),
      var(--accent-color-a)
    );
    --darker-accent-color: hsla(
      var(--accent-color-h),
      var(--accent-color-s),
      calc(var(--accent-color-l) - 8%),
      var(--accent-color-a)
    );
    --darkest-accent-color: hsla(
      var(--accent-color-h),
      var(--accent-color-s),
      calc(var(--accent-color-l) - 18%),
      var(--accent-color-a)
    );
    --selection-color: currentColor;
    --selection-background-color: hsla(
      var(--accent-color-h),
      var(--accent-color-s),
      calc(var(--accent-color-l) + 10%),
      0.7
    );
  }
</style>
