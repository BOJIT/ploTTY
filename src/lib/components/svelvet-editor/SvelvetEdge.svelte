<!--
 * @file SvelvetEdge.svelte
 * @author James Bennion-Pedley
 * @brief Standard Edge for ploTTY Graph
 * @date 18/07/2023
 *
 * @copyright Copyright (c) 2023
 *
-->

<script lang="ts">
    /*-------------------------------- Imports -------------------------------*/

    import { Edge } from "svelvet";

    import { graphRunning } from "$lib/stores/runState"; // TODO make this a prop?

    /*--------------------------------- Props --------------------------------*/

    let selected: boolean = false;

    /*-------------------------------- Methods -------------------------------*/

    /*------------------------------- Lifecycle ------------------------------*/
</script>

<Edge
    let:destroy
    animate={$graphRunning}
    enableHover
    edgeClick={() => {
        selected = !selected;
    }}
/>

<style>
    /* path {
        stroke: rgb(246, 231, 20);
        stroke-width: 4px;
    } */
</style>
