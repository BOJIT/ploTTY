<!--
 * @file AddComponent.svelte
 * @author James Bennion-Pedley
 * @brief Add New Component Dialogue
 * @date 08/02/2023
 *
 * @copyright Copyright (c) 2023
 *
-->

<script lang="ts">
    /*-------------------------------- Imports -------------------------------*/

    import { createEventDispatcher } from "svelte";

    import { SearchableList } from "@bojit/svelte-components/form";
    import { BaseDialog } from "@bojit/svelte-components/layout";

    import { Add, ExtensionPuzzle } from "@svicons/ionicons-outline";

    // Stores
    import components, { type ComponentLibrary } from "$lib/stores/components";

    /*--------------------------------- Props --------------------------------*/

    export let visible: boolean = true;

    let searchableList: SearchableList;
    let dispatch = createEventDispatcher();

    /*-------------------------------- Methods -------------------------------*/

    function storeTransform(c: ComponentLibrary) {
        const dict: any = {};
        Object.entries(c).forEach((c) => {
            dict[c[0]] = {
                icon: c[1].ui?.icon ? c[1].ui?.icon : ExtensionPuzzle,
            };
        });

        return dict;
    }

    /*------------------------------- Lifecycle ------------------------------*/

    $: if (visible) {
        if (searchableList) {
            if (searchableList.focus) searchableList?.focus();
        }
    }
</script>

<BaseDialog title="Add Component" icon={Add} bind:visible>
    <SearchableList
        bind:this={searchableList}
        items={storeTransform($components)}
        on:select={(s) => {
            setTimeout(async () => {
                dispatch("add", s.detail);
                visible = false;
            }, 200);
        }}
    />
</BaseDialog>
