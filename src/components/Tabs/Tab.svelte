<script lang="ts">

    export let closeable = true;
    export let selected = false;
    export let icon: string;
    export let title: string;

</script>

<x-tab selected on:click={(e) => console.log(e)} on:keydown>
    <x-label>Item one</x-label>

    {#if closeable}
        <!-- <Button
            color="transparent"
            style="padding-inline: 0px; margin-left: 1em;"
        >
            <x-icon href="#add" />
        </Button> -->
    {/if}
</x-tab>

<x-tab>
    <x-icon href="#send" />
    <x-label>Item two</x-label>
</x-tab>

<style>
</style>
