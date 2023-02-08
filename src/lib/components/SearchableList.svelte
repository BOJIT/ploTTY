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
    export let maxHeight: string = "30rem";

    let field: HTMLElement;
    let list: HTMLElement;
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

    function moveIndex(dir: 'up' | 'down') {
        if(dir === 'down') {
            if(selectedIndex && (selectedIndex > 0))
                selectedIndex--;
        } else {
            if(selectedIndex === null)
                selectedIndex = 0;
            else if(selectedIndex < searchList(items, $searchString).length - 1)
                selectedIndex++;
        }

        // Ensure component is in view
        if(selectedIndex !== null) {
            const sel = list.children.item(selectedIndex);
            sel?.scrollIntoView(dir === 'down');
        }
    }

    function handleKeydown(event: KeyboardEvent) {
        // Move selection up and down
        if(event.key === 'ArrowDown') {
            event.preventDefault();
            moveIndex('up');
        } else if(event.key === 'ArrowUp') {
            event.preventDefault();
            moveIndex('down');
        }

        // Refocus on enter, dispatch if selected
        else if(event.key === 'Enter') {
            if((selectedIndex !== null) && (selectedIndex < searchList(items, $searchString).length))
                dispatch('select', searchList(items, $searchString)[selectedIndex].key);

            setTimeout(focus, 100);
        }
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
        <div class="list" bind:this={list}>
            {#each searchList(items, $searchString) as l, i}
                <SearchableListItem name={l.key} description={l.description}
                    icon={l.icon} highlight={$searchString}
                    selected={i === selectedIndex}
                    on:click={() => {
                        dispatch('select', searchList(items, $searchString)[i].key);
                    }}
                />
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
