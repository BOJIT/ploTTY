<!--
 * @file SvelvetAPI.svelte
 * @author James Bennion-Pedley
 * @brief Non-DOM component for accessing internal Svelvet context
 * @date 20/06/2023
 *
 * @copyright Copyright (c) 2023
 *
-->

<script lang="ts">
    /*-------------------------------- Imports -------------------------------*/

    import { createEventDispatcher, getContext, onMount } from "svelte";

    import type { Graph as NofloGraphType } from "$lib/middlewares/fbp-graph/Graph";

    import NofloGraph from "$lib/middlewares/fbp-graph";

    /*--------------------------------- Props --------------------------------*/

    export let graph: NofloGraphType;
    export let nodeSelected: string = "";

    const svelvetGraph: any = getContext("graph");
    const { bounds, dimensions, groups } = svelvetGraph;
    const selectedNodes = $groups.selected.nodes;
    const nodeBounds = bounds.nodeBounds;

    const dispatch = createEventDispatcher();

    /*-------------------------------- Methods -------------------------------*/

    function calculateFitView(
        dimensions: any,
        bounds: { top: number; left: number; right: number; bottom: number }
    ) {
        const { width, height } = dimensions;
        const { top, left, right, bottom } = bounds;
        const boundsWidth = right - left;
        const boundsHeight = bottom - top;

        if (!boundsWidth || !boundsHeight)
            return { x: null, y: null, scale: null };

        const centerX = left + boundsWidth / 2;
        const centerY = top + boundsHeight / 2;

        const scale =
            Math.min(width / boundsWidth, height / boundsHeight) * 0.8;

        const viewportCenterX = width / 2;
        const viewportCenterY = height / 2;

        const translateX = viewportCenterX - centerX;
        const translateY = viewportCenterY - centerY;

        return {
            x: translateX * scale,
            y: translateY * scale,
            scale: scale,
        };
    }

    function endTransaction() {
        dispatch("change");
    }

    /*----------------------------- Public Methods ---------------------------*/

    // TODO deprecate
    export function assignTransaction() {
        // This is quite hacky, eventually remove
        graph.removeAllListeners();
        graph.on("endTransaction", endTransaction);
    }

    export function fitGraph() {
        const { x, y, scale } = calculateFitView($dimensions, $nodeBounds);
        svelvetGraph.transforms.translation.set({ x: x || 0, y: y || 0 });
        svelvetGraph.transforms.scale.set(scale || 1);
    }

    export function resetGraph() {
        // Reset graph to initial state
        graph = new NofloGraph.Graph();
        assignTransaction();
        endTransaction();
        nodeSelected = "";
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
        nodeSelected = "";
    }

    export function renameNode(id: string, rename: string) {}

    /*------------------------------- Lifecycle ------------------------------*/

    selectedNodes.subscribe((s: Set<any>) => {
        if (s.size === 1) nodeSelected = [...s][0].id.substring(2);
        else nodeSelected = "";
    });

    onMount(() => {
        assignTransaction();
    });
</script>
