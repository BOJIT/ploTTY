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

    const graph = getContext("graph");
    const groups = graph.groups;
    let selectedNodes = $groups.selected.nodes;

    /*-------------------------------- Methods -------------------------------*/

    /*------------------------------- Lifecycle ------------------------------*/

    selectedNodes.subscribe((s: Set<any>) => {
        if (s.size === 1) $nodeSelected = [...s][0].id.substring(2);
        else $nodeSelected = "";
    });
</script>
