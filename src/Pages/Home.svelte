<script lang="ts">
  import { onMount } from 'svelte'
  import Connect from '../components/Connect/Connect.svelte'
  import type { Line } from '../components/Plotter/Plotter'
  import Plotter from '../components/Plotter/Plotter.svelte'
  import Button from '../components/UI/Button.svelte'

  let lines: Line[] = []

  const generateLine = (freq: number = 1) => {
    const line: Line = {
      // name: 'Line ' + Math.floor(Math.random() * 100),
      points: [],
    }

    for (let i = 0; i < 1000; i += 1) {
      line.points.push({
        x: i,
        y: (Math.sin(i * 0.02) * 250) / freq,
      })
    }

    return line
  }

  onMount(() => {
    for (let i = 1; i < 20; i++) {
      lines = [...lines, generateLine(i)]
    }
  })
</script>

<main>
  <connect-container>
    <Connect />
  </connect-container>
  <plotter-container>
    <Plotter {lines} />
  </plotter-container>
  <buttons-container>
    <x-buttons>
      <Button togglable color="--success">Auto Scroll</Button>
      <Button color="--danger">Clear</Button>
    </x-buttons>
  </buttons-container>
</main>

<style lang="scss">
  main {
    padding: 1em;

    display: flex;
    flex-direction: column;
    flex-grow: 1;
  }

//   connect-container {
//   }

  plotter-container {
    flex-grow: 1;
    margin-top: 0.5em;
  }

  buttons-container {
    margin-top: 0.5em;
    display: flex;
    justify-content: right;
  }
</style>
