<!--
 * @file SelectorItem.svelte
 * @author James Bennion-Pedley
 * @brief Item in Selector Filter
 * @date 11/01/2023
 *
 * @copyright Copyright (c) 2023
 *
-->

<script lang='ts'>
    import { createEventDispatcher } from "svelte";

    import {
        Settings,
    } from "@svicons/ionicons-outline";

    export let name: string = "Unknown";
    export let description: string = "";
    export let icon: string = "help";

    let dispatch = createEventDispatcher();
</script>


<div class="container">
    <div class="left">
        <Settings />
    </div>
    <div class="text left">
        <h4>{name}</h4>
        <!-- <h5>{toCurrency(price)}</h5> -->
    </div>
</div>

<style>
    h4 {
        margin: 0rem !important;
        padding-bottom: 0.2rem;
        overflow: hidden;
        max-width: 18ch;
        text-overflow: ellipsis;
        white-space: nowrap;
    }

    h5 {
        margin: 0rem !important;
        color: var(--color-gray-600)
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
