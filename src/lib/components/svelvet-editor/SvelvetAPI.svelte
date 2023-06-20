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

    import { getContext } from "svelte";

    import { nodeSelected } from "$lib/stores/runState";

    /*--------------------------------- Props --------------------------------*/

    const graph: any = getContext("graph");
    const { bounds, dimensions, groups } = graph;
    const selectedNodes = $groups.selected.nodes;
    const nodeBounds = bounds.nodeBounds;

    /*-------------------------------- Methods -------------------------------*/

    // TODO import this from Svelvet library
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

    export function fitGraph() {
        const { x, y, scale } = calculateFitView($dimensions, $nodeBounds);
        graph.transforms.translation.set({ x: x || 0, y: y || 0 });
        graph.transforms.scale.set(scale || 1);
    }

    /*------------------------------- Lifecycle ------------------------------*/

    selectedNodes.subscribe((s: Set<any>) => {
        if (s.size === 1) $nodeSelected = [...s][0].id.substring(2);
        else $nodeSelected = "";
    });
</script>
