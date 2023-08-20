<!--
 * @file SvelvetEditor.svelte
 * @author James Bennion-Pedley
 * @brief Wrapper for all things related to Svelvet
 * @date 30/05/2023
 *
 * @copyright Copyright (c) 2023
 *
-->

<script lang="ts">
    /*-------------------------------- Imports -------------------------------*/

    import { createEventDispatcher, onMount } from "svelte";

    import type { ThemeMode } from "@bojit/svelte-components/theme/theme";
    import type { Graph as NofloGraphType } from "$lib/middlewares/fbp-graph/Graph";

    import { Background, Svelvet, Minimap } from "svelvet";

    import NofloGraph from "$lib/middlewares/fbp-graph";
    import SvelvetAPI from "$lib/components/svelvet-editor/SvelvetAPI.svelte";
    import SvelvetNode from "$lib/components/svelvet-editor/SvelvetNode.svelte";
    import SvelvetEdge from "$lib/components/svelvet-editor/SvelvetEdge.svelte";

    import components from "$lib/stores/components";

    /*--------------------------------- Props --------------------------------*/

    export let theme: ThemeMode = "light";
    export let graph: NofloGraphType = new NofloGraph.Graph();
    export let api: SvelvetAPI; // Has to be separate component to get context
    export let nodeSelected: string[] = [];

    let nodes = graph.nodes;

    const dispatch = createEventDispatcher();

    /*-------------------------------- Methods -------------------------------*/

    function dispatchChange() {
        nodes = graph.nodes; // assignment to trigger update
        graph = graph;
        dispatch("change");
    }

    function addConnection(e: CustomEvent) {
        api.addEdge(e.detail);
        dispatchChange();
    }

    function removeConnection(e: CustomEvent) {
        api.removeEdge(e.detail);
        dispatchChange();
    }

    /*------------------------------- Lifecycle ------------------------------*/

    // Reset any state that needs an explicit update
    $: {
        nodes = graph.nodes;
        graph.removeAllListeners();
        graph.on("endTransaction", dispatchChange);
    }

    onMount(() => {
        // This is quite hacky, eventually remove
        graph.removeAllListeners();
        graph.on("endTransaction", dispatchChange);
    });
</script>

<Svelvet
    id="svelvet-editor"
    {theme}
    editable
    snapTo={2}
    edge={SvelvetEdge}
    modifier="shift"
    on:connection={addConnection}
    on:disconnection={removeConnection}
>
    <SvelvetAPI
        bind:this={api}
        bind:graph
        bind:nodeSelected
        on:change={dispatchChange}
    />
    <Minimap
        width={100}
        corner="NE"
        mapColor={theme === "light" ? "rgb(180, 180, 180)" : "rgb(80, 80, 80)"}
        slot="minimap"
    />
    <Background
        gridWidth={40}
        dotSize={1}
        slot="background"
        majorGrid={4}
        minOpacity={0.1}
    />

    {#each nodes as n (n.id)}
        {#if $components[n.component] !== undefined}
            <SvelvetNode
                id={n.id}
                label={n.metadata.label ? n.metadata.label : n.component}
                icon={$components[n.component].ui?.icon}
                colour={$components[n.component].ui?.colour}
                bind:position={n.metadata.position}
                portConfig={n.metadata.portConfig}
                inports={$components[n.component].inPorts !== undefined
                    ? Object.keys($components[n.component].inPorts)
                    : []}
                outports={$components[n.component].outPorts !== undefined
                    ? Object.keys($components[n.component].outPorts)
                    : []}
            />
        {:else}
            <h1>RENDERING ERROR</h1>
        {/if}
    {/each}
</Svelvet>

<style>
    /* Svelvet Theme Overrides */
    :global(:root[svelvet-theme="light"]) {
        --default-background-color: rgba(255, 255, 255, 0.6) !important;
        --default-target-edge-color: rgb(212, 221, 129) !important;
        --anchor-border-color: #444444;
        --anchor-connected-border: #444444;
        --anchor-hovering-border: #444444;
        --shadow-color: 0 0 0;
    }

    :global(:root[svelvet-theme="dark"]) {
        --default-background-color: rgba(26, 26, 26, 0.6) !important;
        --default-target-edge-color: rgb(169, 202, 139) !important;
        --anchor-border-color: #444444;
        --anchor-connected-border: #444444;
        --anchor-hovering-border: #444444;
        --shadow-color: 0 0 0;
    }

    /* Disable transparency for low-graphics mode */
    :global(.low-graphics) :global(#background-wrapper) {
        --background-color: rgb(255, 255, 255) !important;
    }

    :global(.mode-dark) :global(.low-graphics) :global(#background-wrapper) {
        --background-color: rgb(26, 26, 26) !important;
    }
</style>
