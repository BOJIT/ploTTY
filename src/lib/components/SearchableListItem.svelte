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
    /*-------------------------------- Imports -------------------------------*/

    import { createEventDispatcher, SvelteComponent } from "svelte";

    // import createRipple from "@bojit/svelte-components/smelte/components/Ripple/ripple.js";

    /*--------------------------------- Props --------------------------------*/

    export let name: string = "Unknown";
    export let description: string | undefined = "";
    export let icon: SvelteComponent | undefined = undefined;
    export let highlight: string = "";
    export let selected: boolean = false;

    let dispatch = createEventDispatcher();
    // let ripple = createRipple('white');

    /*-------------------------------- Methods -------------------------------*/

    function highlightedString(str: string, cmp: string) {
        if(cmp === "")
            return str;

        const re = new RegExp(cmp, "gi");
        const marked = str.replace(re, function(match) {
            return '<span class="highlight">' + match + '</span>'
        });

        return marked;
    }
</script>


<div class="container overflow-hidden" class:selected on:click={() => {
    dispatch('click');
}} on:keypress>
    <div class="left">
        <svelte:component this={icon} height="2rem"/>
    </div>
    <div class="text left">
        <h5>{@html highlightedString(name, highlight)}</h5>
        {#if description !== "" && description !== undefined}
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
        border: 4px solid transparent;
        transition: background-color 0.2s;
        transition: box-shadow 0.2s;

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

    .container.selected {
        box-shadow: 0px 0px 4px #4195fc;
    }

    .left {
        padding: 1rem;
    }

    .text {
        flex-grow: 1;
        padding-left: 0rem;
    }

    h5 :global(.highlight) {
        color: #524d0d;
        background-color: #ffe676be;
    }

    :global(.mode-dark) h5 :global(.highlight) {
        color: yellow;
        background-color: #64540b49;
    }
</style>
