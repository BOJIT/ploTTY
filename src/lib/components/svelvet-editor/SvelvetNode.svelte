<!--
 * @file SvelvetNode.svelte
 * @author James Bennion-Pedley
 * @brief Brief summary here
 * @date 29/05/2023
 *
 * @copyright Copyright (c) 2023
 *
-->

<script lang="ts">
    /*-------------------------------- Imports -------------------------------*/

    import type { SvelteComponent } from "svelte";

    import { Node, Anchor } from "svelvet";

    import { ExtensionPuzzle as DefaultIcon } from "@svicons/ionicons-outline";

    /*--------------------------------- Props --------------------------------*/

    export let id: string;
    export let position:
        | {
              x: number;
              y: number;
          }
        | undefined;
    export let icon: SvelteComponent = DefaultIcon;

    export let inports: string[] = [];
    export let outports: string[] = [];

    /*-------------------------------- Methods -------------------------------*/

    function handleClick(e: CustomEvent) {
        const { detail } = e;
        console.log(e);
    }

    /*------------------------------- Lifecycle ------------------------------*/
</script>

<div />

<Node
    bind:id
    bind:position
    let:grabHandle
    let:selected
    on:nodeClicked={handleClick}
    width={100}
    height={100}
>
    <div use:grabHandle class:selected class="node">
        <div class="slab">
            <div class="icon">
                <svelte:component this={icon} height="70px" color="#c8ced0" />
            </div>
        </div>
        <div class="ports inports">
            {#each inports as ip}
                <Anchor input />
            {/each}
        </div>
        <div class="ports outports">
            {#each outports as op}
                <Anchor output />
            {/each}
        </div>
    </div>
</Node>

<style>
    .node {
        border-radius: 20px;
        border: 5px solid #444444;

        height: 100px;
        width: 100px;

        position: absolute;
        display: grid;
        place-items: center;

        user-select: none;
        justify-content: center;
        overscroll-behavior: auto;
        align-items: center;
        text-align: center;
    }

    .slab {
        grid-row: 1;
        grid-column: 1;

        width: 90px;
        height: 100%;

        position: relative;
    }

    .icon {
        position: absolute;
        top: 2px;
        left: 2px;

        background-color: #d9e1e3;

        width: calc(100% - 4px);
        height: calc(100% - 4px);
        border-radius: 13px;
        background-color: #d8e0e2f7;

        display: grid;
        place-items: center;
    }

    .ports {
        grid-row: 1;
        grid-column: 1;
        z-index: 1;

        position: relative;
        display: flex;
        flex-direction: column;
        gap: 15px;
    }

    .inports {
        justify-self: start;
        left: -13px;
    }

    .outports {
        justify-self: end;
        right: -13px;
    }
</style>
