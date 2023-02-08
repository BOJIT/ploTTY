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

    let field: HTMLElement;
    let searchString: Writable<string> = writable("");
    let selectedIndex: number | null = null;

    const dispatch = createEventDispatcher();

    /*-------------------------------- Methods -------------------------------*/

    export function focus() {
        if(field === undefined)
            return;

        let input = field.querySelector('input');
            input?.focus();
    }

    function handleKeydown(event: KeyboardEvent) {
        // TODO: typing in box

        // Move selection up and down
        if(event.key === 'ArrowDown') {
            event.preventDefault();
            if(selectedIndex === null)
                selectedIndex = 0;
            else if(selectedIndex < searchList(items, $searchString).length - 1)
                selectedIndex++;
        } else if(event.key === 'ArrowUp') {
            event.preventDefault();
            if(selectedIndex && (selectedIndex > 0))
                selectedIndex--;
        }

        // TODO enter dispatch
    }

    function searchList(dict: ListDict, search: string) {
        // Sort alphabetically, return matching keys
        let keys =  Object.keys(dict).sort((a, b) => a.localeCompare(b))
        if(search !== "")
            keys = keys.filter((s) => s.toLowerCase().includes(search.toLowerCase()));
        const list = keys.map((k) => {
            let e: ListItem = dict[k];
            e.key = k;
            return e;
        });

        // See if selected entry needs updating
        if(selectedIndex && (selectedIndex >= list.length))
            selectedIndex = null;

        if(list.length === 1)
            selectedIndex = 0;

        return list;
    }

    /*------------------------------- Lifecycle ------------------------------*/
</script>


<svelte:window on:keydown={handleKeydown}/>

<div class="container">
    <form autocomplete="off" bind:this={field} class="overflow">
        <TextField outlined prepend="search" bind:value={$searchString}
            color="secondary"
            error={searchList(items, $searchString).length === 0 ? "Item Not Found" : false}
        />
    </form>

    <div class="overflow" data-simplebar style:max-height={maxHeight}>
        <div class="list">
            {#each searchList(items, $searchString) as l, i}
                <SearchableListItem name={l.key} description={l.description}
                icon={l.icon} highlight={$searchString}
                selected={i === selectedIndex}/>
            {/each}
        </div>
    </div>
</div>


<style>
    .overflow {
        padding-left: 4px;
        padding-right: 4px;
        padding-bottom: 4px;
    }

    .list {
        display: flex;
        flex-direction: column;
        gap: 0.5rem;
    }
</style>
