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

    import { graphRunning } from "$lib/stores/runState";
    import settings from "$lib/stores/settings";

    /*--------------------------------- Props --------------------------------*/

    /*-------------------------------- Methods -------------------------------*/

    let targetDiv: HTMLDivElement;
    let deleteConfirmation: boolean = false;

    /*------------------------------- Lifecycle ------------------------------*/
</script>

<Edge
    let:destroy
    targetColor={deleteConfirmation ? "#bf288d" : null}
    animate={$graphRunning && !$settings.switches.lowGraphicsMode}
    enableHover
    edgeClick={() => {
        targetDiv.click();
    }}
>
    <div slot="label">
        <div
            bind:this={targetDiv}
            on:click={() => {
                if (deleteConfirmation) {
                    destroy();
                } else {
                    // Wait for confirmation
                    deleteConfirmation = true;
                    setTimeout(() => {
                        deleteConfirmation = false;
                    }, 500);
                }
            }}
            on:keypress
        />
    </div>
</Edge>

<style>
</style>
