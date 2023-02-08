<!--
 * @file SearchableListItem.svelte
 * @author James Bennion-Pedley
 * @brief Item in Selector Filter
 * @date 11/01/2023
 *
 * @copyright Copyright (c) 2023
 *
-->

<script lang='ts'>
    import { createEventDispatcher, SvelteComponent } from "svelte";

    import {
        ChevronForward,
    } from "@svicons/ionicons-outline";

    export let name: string = "Unknown";
    export let description: string = "";
    export let icon: SvelteComponent = ChevronForward;

    let dispatch = createEventDispatcher();
</script>


<div class="container">
    <div class="left">
        <svelte:component this={icon} height="2rem"/>
    </div>
    <div class="text left">
        <h5>{name}</h5>
        {#if description !== ""}
            <h6>{description}</h6>
        {/if}
    </div>
</div>

<style>
    h5 {
        margin: 0rem !important;
        overflow: hidden;
        max-width: 18ch;
        text-overflow: ellipsis;
        white-space: nowrap;
    }

    h6 {
        margin: 0rem !important;
        color: var(--color-gray-600);
        padding-top: 0.2rem;
    }

    .container {
        /* padding: 1rem; */
        border-radius: 0.5rem;
        overflow: hidden;
        background-color: #f5f2f0;
        transition: background-color 0.2s;

        display: flex;
        align-items: center;
    }

    :global(.mode-dark) .container {
        background-color: #2d2d2d;
    }

    .container:hover {
        background-color: #dedcdb;
    }

    :global(.mode-dark) .container:hover {
        background-color: #3c3c3c;
    }

    .left {
        padding: 1rem;
    }

    .text {
        flex-grow: 1;
        padding-left: 0rem;
    }
</style>
