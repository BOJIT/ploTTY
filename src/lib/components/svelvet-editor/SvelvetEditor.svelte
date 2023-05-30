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

    import {
        Background,
        Svelvet,
        Minimap,
        type Graph as SvelvetGraph,
    } from "svelvet";

    import { Add, Trash } from "@svicons/ionicons-outline"; // TODO delete!!!

    import NofloGraph from "$lib/middlewares/fbp-graph";
    import SvelvetNode from "$lib/components/svelvet-editor/SvelvetNode.svelte";

    /*--------------------------------- Props --------------------------------*/

    export let theme: ThemeMode = "light";
    export let graph: NofloGraphType = new NofloGraph.Graph();
    let nodes = graph.nodes;

    const dispatch = createEventDispatcher();

    /*-------------------------------- Methods -------------------------------*/

    export function fitGraph() {
        // const { x, y, scale } = calculateFitView($dimensions, $nodeBounds);
        // transforms.translation.set({ x: x || 0, y: y || 0 });
        // transforms.scale.set(scale || 1);
    }

    export function addNode(type: string) {
        /* Generate random ID then check that it is unique for the graph */
        let id = Math.round(Math.random() * 100000).toString(36);
        while (graph.nodes.some((node) => node.id === id)) {
            id = Math.round(Math.random() * 100000).toString(36);
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
            label: type,
            position: {
                x: window.innerWidth / 2 + increment,
                y: window.innerHeight / 2 + increment,
            },
        };

        graph.addNode(id, type, metadata);
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

    // On change ensure that endTransaction hook is set
    $: {
        graph.removeAllListeners();
        graph.on("endTransaction", endTransaction);
    }
    onMount(() => {
        graph.removeAllListeners();
        graph.on("endTransaction", endTransaction);
    });
</script>

<Svelvet id="svelvet-editor" {theme} editable snapTo={2}>
    <Minimap
        width={100}
        corner="NE"
        mapColor={theme === "light" ? "rgb(180, 180, 180)" : "rgb(80, 80, 80)"}
        slot="minimap"
    />
    <Background gridWidth={40} dotSize={1} slot="background" />

    {#each nodes as n}
        <SvelvetNode
            id={n.id}
            bind:position={n.metadata.position}
            inports={["test", "tag", "t"]}
            outports={["test"]}
        />
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
