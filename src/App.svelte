<script lang="ts">
  import { onDestroy, onMount } from "svelte";
  import { Svrollbar } from "svrollbar";
  import { fade } from "svelte/transition";
  import Home from "./Pages/Home.svelte";
  import {
    connectWebSocket,
    disconnectWebSocket,
    socketInfo,
  } from "./stores/socket.store";
  import { serial } from "./stores/serial.store";
  import Tabs from "./components/Tabs/Tabs.svelte";

  $: disconnected = !$socketInfo.connected;

  connectWebSocket();

  const unsub: (() => void)[] = [];
  onMount(() => {
    document
      .querySelector('meta[name="xel-accent-color"]')
      ?.setAttribute(
        "content",
        getComputedStyle(document.body).getPropertyValue("--primary")
      );
    document
      .querySelector('meta[name="xel-size"]')
      ?.setAttribute("content", "small");

    unsub.push(
      serial.onConnect(() => {
        console.log("Connected to serial");
      })
    );

    unsub.push(
      serial.onDisconnect(() => {
        console.log("Disconnected from serial");
      })
    );

    return () => {
      unsub.forEach((u) => u?.());
    };
  });

  onDestroy(() => {
    disconnectWebSocket();
  });
</script>

<svelte:window on:contextmenu|preventDefault />

<main class:disconnected>
  <Tabs />
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

    transition: box-shadow 0s linear;
    transition-delay: 0s;
    &.disconnected {
      transition: box-shadow 0.5s ease-in;
      transition-delay: 0.5s;
      box-shadow: inset 0 0 0 1px var(--danger);
      border-radius: 8px;
    }
  }
</style>
