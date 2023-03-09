<script lang="ts">
  import { onDestroy, onMount } from "svelte";
  import {
    Button,
    Select,
    SelectItem,
    TextInput,
  } from "carbon-components-svelte";
  import { PortInfo } from "../../../server/interfaces";
  import { BaudList, serial } from "../../stores/serial.store";

  let selectedPort: string;
  let selectedBaud: number;
  let inputValue: string;
  $: valid = selectedPort && selectedBaud;

  let portList: PortInfo[] = [];
  let serialInfo = serial.info;

  async function connect() {
    if (!selectedPort || !selectedBaud) return;
    await serial.connect(selectedPort, selectedBaud);
  }
  async function disconnect() {
    serial.disconnect();
  }
  async function send() {
    if (!inputValue) return;
    await serial.send(inputValue);
  }

  let unsub: (() => void)[] = [];
  onMount(async () => {
    unsub.push(
      serial.subscribe((data) => {
        console.log(data);
      })
    );

    portList = await serial.list();
  });

  onDestroy(() => {
    unsub.forEach((u) => u?.());
  });
</script>

<main>
  <Select bind:selected={selectedPort}>
    <SelectItem text="Select Port" disabled hidden />
    <hr />
    {#each portList as port}
      <SelectItem
        value={port.path}
        text={"friendlyName" in port && typeof port.friendlyName === "string"
          ? port.friendlyName
          : port.path}
      />
    {/each}
  </Select>

  <Select bind:selected={selectedBaud}>
    <SelectItem text="Select Buadrate" disabled hidden />
    <hr />
    {#each BaudList as b}
      <SelectItem value={b} text={b.toString()} />
    {/each}
  </Select>

  <br />
  {#if !$serialInfo.connected}
    <Button disabled={!valid} color="--success" size="small" on:click={connect}
      >Connect</Button
    >
  {:else}
    <Button
      disabled={!valid}
      color="--danger"
      size="small"
      on:click={disconnect}>Disconnect</Button
    >
  {/if}

  <br />
  <br />
  <div class="send-container">
    <TextInput
      placeholder="Send message to serial device"
      type="text"
      bind:value={inputValue}
    />
    <Button
      disabled={!valid || !$serialInfo.connected}
      color="--primary"
      size="small"
      on:click={send}>Send</Button
    >
  </div>
  <br />
</main>

<style lang="scss">
  .send-container {
    display: flex;
    align-items: center;
    gap: 1rem;
  }
</style>
