<!--
 * @file SelectorFilter.svelte
 * @author James Bennion-Pedley
 * @brief Selector Dropdown/Filter Box
 * @date 11/09/2022
 *
 * @copyright Copyright (c) 2022
 *
-->

<script lang='ts'>
    /*-------------------------------- Imports -------------------------------*/

    import { createEventDispatcher } from 'svelte';

    import TextField from "@bojit/svelte-components/smelte/components/TextField/TextField.svelte";
    import List from "@bojit/svelte-components/smelte/components/List/List.svelte";

    /* Custom Scrollbar */
    import 'simplebar';
    import 'simplebar/dist/simplebar.css';

    /*--------------------------------- Props --------------------------------*/

    // Public props
    export let label: string = "parameter";
    export let items: string[] = [];
    export let maxHeight: string = "10rem";

    // Dialogue styling
    export let dialog: boolean = false;

    let search: string = "";
    let matches: number = items.length;

    export let visibleItems: string[] = items;
    let listItems: object[] = [];
    $ : listItems = visibleItems.map((i) => {
        return { 'text': i, 'icon': 'chevron_right' }
    });

    let  focused: boolean;
    const dispatch = createEventDispatcher();

    /*-------------------------------- Methods -------------------------------*/

    function handleKeydown(event: KeyboardEvent) {
        if(!focused)
            return;

        if((event.key === 'Enter') && (matches === 1))
            optionSelected(visibleItems[0]);   // Fill box
    }

    function inputChange() {
        /* Get number of matches */
        visibleItems = items.filter(s => s.toLowerCase().includes(search.toLowerCase()));
        matches = visibleItems.length;
    }

    function optionSelected(option: string) {
        search = option;   // Fill box
        focused = false;
        dispatch('select', option);
    }

    /*------------------------------- Lifecycle ------------------------------*/
</script>


<svelte:window on:keydown={handleKeydown}/>

<div class="contents" class:dialog>
    <TextField label={label} prepend="search" bind:focused={focused}
        bind:value={search} on:input={inputChange}
        error={matches === 0 ? "No Matches" : ""}
        success={matches === 1 ? "Success" : ""}
    />
    <div class="overflow" data-simplebar style:max-height={maxHeight}>
        <List items={listItems} on:change={(e) => { optionSelected(e.detail); }}/>
    </div>
</div>


<style>
    .contents {
        width: 100%;
        margin-top: 1rem;
        margin-bottom: 1rem;
    }

    .contents > :global(div) {
        margin-bottom: 0rem;
    }

    .overflow {
        min-height: 1.5rem;
        border-bottom: 1px solid var(--color-gray-600);
        overflow: scroll;
        background-color: #44444411;
    }

    .overflow  :global(ul) {
        padding: 0;
    }

    .dialog {
        width: 30rem;
    }

    .dialog > .overflow {
        background-color: #aaaaaa33;
    }

    @media (max-width: 768px) {
        .dialog {
            width: 90vw;
        }
    }
</style>
