<script lang="ts" context="module">
    import { SvelteComponent } from "svelte";

    export type TabItem = {
        title: string;
        icon: string;
        closeable: boolean;
        component: SvelteComponent;
        keepAlive: boolean;
    };
</script>
<script lang="ts">
    import Tab from "./Tab.svelte";
    import TabContent from "./TabContent.svelte";

    export let tabs: TabItem[] = [];
</script>

<main>
    <x-tabs>

        {#each tabs as tab}
            <Tab
                title={tab.title}
                icon={tab.icon}
                closeable={tab.closeable}
                component={tab.component}
                keepAlive={tab.keepAlive}
            />
        {/each}
    </x-tabs>

    <svelte:component this={TabContent} />

    <TabContent />
</main>

<style>
</style>
