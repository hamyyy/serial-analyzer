<script lang="ts">
  import { onDestroy, onMount } from "svelte";
  import { PortInfo } from "../../../server/interfaces";
  import { listPorts } from "../../stores/serial.store";
  import { socket } from "../../stores/socket.store";
  import Button from "../UI/Button.svelte";

  let portList: PortInfo[] = [];
  let selectedPort: string = null;

  let toggled = false;

  let inputValue = "hey";

  function onPortSelect({
    detail: data,
  }: CustomEvent<{ oldValue: string; newValue: string }>) {
    selectedPort = data.newValue;
  }

  async function connect() {}
  async function disconnect() {}
  async function send() {}

  onMount(async () => {
    toggled = true;
    socket.on("serial", (data) => {
      console.log(data);
    });
    
    portList = await listPorts();
  });

  onDestroy(() => {});
</script>

<main>
  <!-- <Button>Connect</Button> -->

  <x-tabs>
    <x-tab selected on:click={(e) => console.log(e)} on:keydown>
      <x-label>Item one</x-label>
      <Button
        color="transparent"
        style="padding-inline: 0px; margin-left: 1em;"
      >
        <x-icon href="#add" />
      </Button>
    </x-tab>

    <x-tab>
      <x-icon href="#send" />
      <x-label>Item two</x-label>
    </x-tab>

    <x-tab>
      <x-icon href="#wrench" />
      <x-label>Item three</x-label>
    </x-tab>
  </x-tabs>

  <x-select on:change={onPortSelect}>
    <x-menu>
      <x-menuitem value={null} {toggled} disabled>
        <x-label>Select Port</x-label>
      </x-menuitem>

      <hr />

      {#each portList as port}
        <x-menuitem value={port.path}>
          <x-label
            >{"friendlyName" in port ? port.friendlyName : port.path}</x-label
          >
        </x-menuitem>
      {/each}
    </x-menu>
  </x-select>

  <x-buttons>
    <x-input type="text" value={inputValue} />
    <input type="text" bind:value={inputValue} />
    <Button color="--primary" on:click={send}>Send</Button>
    <Button color="--success" on:click={connect}>Connect</Button>
    <Button color="--danger" on:click={disconnect}>Disconnect</Button>
  </x-buttons>
</main>

<style lang="scss">
  x-icon[href="#add"] {
    rotate: 45deg;
    opacity: 0.5;
    border-radius: 50%;
    cursor: pointer;
    &:hover {
      opacity: 1;
    }
  }
</style>
