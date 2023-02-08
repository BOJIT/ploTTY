<!--
 * @file SearchableLisr.svelte
 * @author James Bennion-Pedley
 * @brief Selector Dropdown/Filter Box
 * @date 11/09/2022
 *
 * @copyright Copyright (c) 2022
 *
-->

<script lang='ts'>
    /*-------------------------------- Imports -------------------------------*/

    import { writable, type Writable } from 'svelte/store';
    import { createEventDispatcher, SvelteComponent } from 'svelte';

    import TextField from "@bojit/svelte-components/smelte/components/TextField/TextField.svelte";

    /* Custom Scrollbar */
    import 'simplebar';
    import 'simplebar/dist/simplebar.css';
    import SearchableListItem from './SearchableListItem.svelte';

    /*--------------------------------- Types --------------------------------*/

    type ListItem = {
        key?: string,
        description?: string,
        icon?: SvelteComponent,
    };

    type ListDict = {
        [key:string]: ListItem,
    }

    /*--------------------------------- Props --------------------------------*/

    export let items: ListDict = {};
    export let label: string = "parameter";
    export let maxHeight: string = "30rem";

    let searchString: Writable<string> = writable("");

    const dispatch = createEventDispatcher();

    /*-------------------------------- Methods -------------------------------*/

    function handleKeydown(event: KeyboardEvent) {
        // TODO: typing in box

        // TODO move up and down

        // TODO enter dispatch
    }

    function searchList(dict: ListDict, search: string) {
        let keys =  Object.keys(dict).sort((a, b) => a.localeCompare(b))
        if(search !== "")
            keys = keys.filter((s) => s.toLowerCase().includes(search.toLowerCase()));
        const list = keys.map((k) => {
            let e: ListItem = dict[k];
            e.key = k;
            return e;
        });
        return list;
    }

    // function optionSelected(option: string) {
    //     search = option;   // Fill box
    //     focused = false;
    //     dispatch('select', option);
    // }

    /*------------------------------- Lifecycle ------------------------------*/
</script>


<svelte:window on:keydown={handleKeydown}/>

<div class="container">
    <form autocomplete="off">
        <TextField outlined prepend="search" bind:value={$searchString}
            error={searchList(items, $searchString).length === 0 ? "Item Not Found" : false}/>
    </form>

    <div class="overflow" data-simplebar style:max-height={maxHeight}>
        <div class="list">
            {#each searchList(items, $searchString) as l, i}
                <SearchableListItem name={l.key} description={l.description}
                icon={l.icon} highlight={$searchString}/>
            {/each}
        </div>
    </div>
</div>


<style>
    .list {
        display: flex;
        flex-direction: column;
        gap: 0.5rem;
    }
</style>
