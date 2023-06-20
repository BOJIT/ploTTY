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

    import components from "$lib/stores/components";

    /*--------------------------------- Props --------------------------------*/

    export let theme: ThemeMode = "light";
    export let graph: NofloGraphType = new NofloGraph.Graph();
    let nodes = graph.nodes;

    let api: SvelvetAPI;

    const dispatch = createEventDispatcher();

    /*-------------------------------- Methods -------------------------------*/

    export function fitGraph() {
        api.fitGraph();
    }

    export function addNode(type: string) {
        /* Generate node ID - this is a sanitised string with increasing index */
        const root = type.split("/").pop()?.replace(/\s/g, "-"); // Start as node identifier
        let id: string = root;
        let suffix = 1;
        while (graph.nodes.some((node) => node.id === id)) {
            id = `${root}${suffix}`;
            suffix += 1;
        }

        /* Place in stack if place is taken */
        let increment = 0;
        while (
            graph.nodes.some(
                (node) =>
                    node.metadata.position.x ===
                    window.innerWidth / 2 + increment
            )
        ) {
            increment += 20;
        }

        /* Add UI-related metadata */
        const metadata = {
            position: {
                x: window.innerWidth / 2 + increment,
                y: window.innerHeight / 2 + increment,
            },
        };

        graph.addNode(id, type, metadata);
    }

    export function removeNode(id: string) {
        graph.removeNode(id);
    }

    export function resetGraph() {
        // Reset graph to initial state
        graph = new NofloGraph.Graph();
        graph.removeAllListeners();
        graph.on("endTransaction", endTransaction);

        endTransaction();
    }

    /*------------------------------- Lifecycle ------------------------------*/

    function endTransaction() {
        nodes = graph.nodes; // assignment to trigger update
        graph = graph;
        dispatch("change");
    }

    // Reset any state that needs an explicit update
    $: {
        nodes = graph.nodes;
        graph.removeAllListeners();
        graph.on("endTransaction", endTransaction);
    }
    onMount(() => {
        graph.removeAllListeners();
        graph.on("endTransaction", endTransaction);
    });
</script>

<Svelvet id="svelvet-editor" {theme} editable snapTo={2}>
    <SvelvetAPI bind:this={api} />
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

    {#each nodes as n}
        {#if $components[n.component] !== undefined}
            <SvelvetNode
                id={n.id}
                label={n.metadata.label ? n.metadata.label : n.component}
                icon={$components[n.component].ui?.icon}
                bind:position={n.metadata.position}
                on:change={() => {
                    // HACK: force store to update. TODO subscribe to store.
                    n.metadata.position = n.metadata.position;
                }}
                inports={$components[n.component].inputs !== undefined
                    ? Object.keys($components[n.component].inputs)
                    : []}
                outports={$components[n.component].outputs !== undefined
                    ? Object.keys($components[n.component].outputs)
                    : []}
            />
        {:else}
            <h1>TODO HANDLE ERROR</h1>
        {/if}
    {/each}
</Svelvet>

<style>
    /* Svelvet Theme Overrides */
    :global(:root[svelvet-theme="light"]) {
        --default-background-color: rgba(255, 255, 255, 0.6) !important;
        --anchor-border-color: #444444;
        --anchor-connected-border: #444444;
        --anchor-hovering-border: #444444;
        --shadow-color: 0 0 0;
    }

    :global(:root[svelvet-theme="dark"]) {
        --default-background-color: rgba(26, 26, 26, 0.6) !important;
        --anchor-border-color: #444444;
        --anchor-connected-border: #444444;
        --anchor-hovering-border: #444444;
        --shadow-color: 0 0 0;
    }
</style>
