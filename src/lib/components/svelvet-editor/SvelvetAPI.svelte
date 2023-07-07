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

    let renamePending: any | null = null;

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

    /*----------------------------- Public Methods ---------------------------*/

    export function fitGraph() {
        const { x, y, scale } = calculateFitView($dimensions, $nodeBounds);
        svelvetGraph.transforms.translation.set({ x: x || 0, y: y || 0 });
        svelvetGraph.transforms.scale.set(scale || 1);
    }

    export function resetGraph() {
        // Copy over listeners
        const listeners = graph.listeners("endTransaction");
        // Reset graph to initial state, then restore listeners
        graph = new NofloGraph.Graph();
        graph.on("endTransaction", listeners[0]);

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

        console.log(graph);
    }

    export function removeNode(id: string) {
        graph.removeNode(id);
        nodeSelected = "";
    }

    export function renameNode(id: string, rename: string) {
        let node = graph.nodes.find((n) => id === n.id);
        if (node === undefined) return;

        renamePending = node;
        node.id = rename; // Assigning this will deselect the node

        node.metadata.label = rename; // Explicit override
        graph = graph; // Trigger prop update
        nodeSelected = node.id;
    }

    /*------------------------------- Lifecycle ------------------------------*/

    selectedNodes.subscribe((s: Set<any>) => {
        if (renamePending) {
            // Deal with annoyance of deselection on id change
            $selectedNodes.add(renamePending);
            renamePending = null;
            $selectedNodes = $selectedNodes;
            return;
        }

        if (s.size === 1) {
            if ([...s][0].id.startsWith("N-"))
                nodeSelected = [...s][0].id.substring(2);
            else nodeSelected = [...s][0].id;
        } else {
            nodeSelected = "";
        }
    });
</script>
