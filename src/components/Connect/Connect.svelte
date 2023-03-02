<script lang="ts" context="module">
  export type PortList = {
    name: string
    manufacturer: string
    product: string
  }
</script>

<script lang="ts">
  import { onDestroy, onMount } from 'svelte'
  import { listen } from '@tauri-apps/api/event'
  import { invoke } from '@tauri-apps/api'
  import type { Child } from '@tauri-apps/api/shell'
  import { Command } from '@tauri-apps/api/shell'
  import Button from '../UI/Button.svelte'

  let portList: PortList[] = []
  let selectedPort: string = null

  let toggled = false

  let inputValue = 'hey'

  function onPortSelect({ detail: data }: CustomEvent<{ oldValue: string; newValue: string }>) {
    console.log(data)
    selectedPort = data.newValue
  }

  let child: Child = null

  async function connect() {
    await invoke('connect_to_port', { portname: selectedPort, baudrate: 115200 })
    // const command = new Command(
    //   './ss.exe -com:3 -baud:115200 -autoconnect:NONE -databits:8 -stopbits:1 -parity:NONE'
    // )
    // command.on('close', (data) => {
    //   console.log(`command finished with code ${data.code} and signal ${data.signal}`)
    // })
    // command.on('error', (error) => console.error(`command error: "${error}"`))
    // command.stdout.on('data', (line) => console.log(`command stdout: "${line}"`))
    // command.stderr.on('data', (line) => console.log(`command stderr: "${line}"`))
    // child = await command.spawn()
    // console.log('pid:', child.pid)
  }
  async function disconnect() {
    await child?.kill()
    // await Tauri.invoke('disconnect')
  }
  async function send() {
    // await child.write('console.log("this is from node, lol")\n')

    invoke('serial_send', { message: "ello gov\n" })

    // await Tauri.invoke('send', { data: inputValue })
  }

  let unsub, unsub2
  onMount(async () => {
    toggled = true

    unsub = await listen('port_list', ({ payload }) => {
      portList = payload as PortList[]
    })

    unsub2 = await listen('serial_data', ({ payload }) => {
      console.log(payload)
    })
  })

  onDestroy(() => {
    unsub()
    unsub2()
  })
</script>

<main>
  <!-- <Button>Connect</Button> -->

  <x-tabs>
    <x-tab selected on:click={(e) => console.log(e)} on:keydown>
      <x-label>Item one</x-label>
      <Button color="transparent" style="padding-inline: 0px; margin-left: 1em;">
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

      {#each portList as { name, product }}
        <x-menuitem value={name}>
          <x-label>{product || name}</x-label>
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
  x-icon[href='#add'] {
    rotate: 45deg;
    opacity: 0.5;
    border-radius: 50%;
    cursor: pointer;
    &:hover {
      opacity: 1;
    }
  }
</style>
