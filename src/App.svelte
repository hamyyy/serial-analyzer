<script lang="ts">
  import { onMount } from 'svelte'
  import { Svrollbar } from 'svrollbar'
  import Connect from './components/Connect/Connect.svelte'
  import Plotter from './components/Plotter/Plotter.svelte'
  import Home from './Pages/Home.svelte'

  onMount(() => {
    document
      .querySelector('meta[name="xel-accent-color"]')
      ?.setAttribute('content', getComputedStyle(document.body).getPropertyValue('--primary'))
    document.querySelector('meta[name="xel-size"]')?.setAttribute('content', 'small')
  })
</script>

<svelte:window on:contextmenu|preventDefault />

<main>
  <Home />
  <Svrollbar />
</main>

<style lang="scss">
  main {
    width: 100vw;
    height: 100vh;
    display: flex;
    // overflow: hidden;

    background-color: var(--dark);
  }
</style>
