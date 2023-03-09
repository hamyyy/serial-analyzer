<script lang="ts">
  import { onMount, onDestroy } from "svelte";
  import Connect from "../components/Connect/Connect.svelte";
  import type { Line } from "../components/Plotter/Plotter";
  import Plotter from "../components/Plotter/Plotter.svelte";
  import { serial } from "../stores/serial.store";
  import { Button, ButtonSet } from "carbon-components-svelte";

  let lines: Line[] = [];

  const generateLine = (freq: number = 1) => {
    const line: Line = {
      // name: 'Line ' + Math.floor(Math.random() * 100),
      points: [],
    };

    for (let i = 0; i < 1000; i += 1) {
      // line.points.push({
      //   x: i,
      //   y: Math.sin(i * 0.02) * 250,
      // });

      line.points.push({
        x: i,
        y: (Math.sin(i * 0.02) * 250) / freq,
      });
    }

    return line;
  };

  const updateLine = (
    line: Line,
    amplitude: number,
    period: number,
    phase: number,
    pixelCompenstation: number
  ) => {
    // generate a sine wave using the given amplitude, frequency and period
    // period = 2 * pi / B
    // B = 2 * pi / period
    // y = A * sin(B(x + C)) + D
    const B = (2 * Math.PI) / period;
    for (let i = 0; i < line.points.length; i++) {
      const x = i;
      line.points[i].x = x;
      line.points[i].y =
        amplitude * Math.sin(B * (x + phase) * pixelCompenstation);
    }
  };

  const unsub: (() => void)[] = [];
  onMount(() => {
    for (let i = 0; i < 1; i++) {
      lines = [...lines, generateLine(i + 1)];
    }

    serial.subscribe((data) => {});

    let count = 0;
    const id = setInterval(() => {
      //   for (let i = 1; i <= lines.length; i++) {
      //     updateLine(
      //       lines[i - 1],
      //       Math.sin(count * 0.01 * i) * 200,
      //       i + Math.sin(count * 0.01) * 10 /*i * Math.sin(count * 0.01) */,
      //       Math.sin(count * 0.01) * 200,
      //       0.01
      //     );
      //   }

      for (const line of lines) {
        for (let i = 0; i < 1; i++) {
          const x = line.points[line.points.length - 1].x + 1;
          line.points.push({
            x: x,
            y: 250 * Math.sin(x * 0.02),
          });
        }
      }

      lines = [...lines];
      count++;
    });

    unsub.push(() => clearInterval(id));
  });

  onDestroy(() => {
    unsub.forEach((u) => u?.());
  });
</script>

<main>
  <Connect />
  <Plotter {lines} />
  <br />
  Click, drag and scroll to pan and zoom
  <!-- <div class="container">
    <Button size="small" tooltipAlignment="center">Auto Scroll</Button>
    <Button size="small">Clear</Button>
    <br />
    <br />
    <ButtonSet>
      <Button size="small" kind="secondary">Cancel</Button>
      <Button size="small">Submit</Button>
    </ButtonSet>
  </div> -->
</main>

<style lang="scss">
  main {
    padding: 1em;

    display: flex;
    flex-direction: column;
    flex-grow: 1;
  }

  plotter-container {
    flex-grow: 1;
    margin-top: 0.5em;
  }

  .container {
    // display: flex;
    // flex-direction: column;
    text-align: end;
  }
</style>
