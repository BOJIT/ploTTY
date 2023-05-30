<!--
 * @file Widget.svelte
 * @author James Bennion-Pedley
 * @brief Container for graphical widgets
 * @date 29/05/2023
 *
 * @copyright Copyright (c) 2023
 *
-->

<script lang="ts">
    /*-------------------------------- Imports -------------------------------*/

    import { Plotter } from "@bojit/svelte-components/widgets";

    /*--------------------------------- Props --------------------------------*/

    /*-------------------------------- Methods -------------------------------*/

    /*------------------------------- Lifecycle ------------------------------*/
</script>

<div class="widget">
    <Plotter demo numLines={10} />
</div>

<style>
    .widget {
        flex-grow: 2;
        display: grid;
        justify-items: center;
        align-items: center;
    }
</style>
