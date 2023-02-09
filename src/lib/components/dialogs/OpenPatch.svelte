<!--
 * @file OpenPatch.svelte
 * @author James Bennion-Pedley
 * @brief Open Patch Dialogue
 * @date 08/02/2023
 *
 * @copyright Copyright (c) 2023
 *
-->

<script lang='ts'>
    /*-------------------------------- Imports -------------------------------*/

    import { onMount } from "svelte";

    import { SearchableList } from "@bojit/svelte-components/form";
    import { BaseDialog } from "@bojit/svelte-components/layout";

    import {
        Document,
        FolderOpen,
    } from "@svicons/ionicons-outline";

    import patch, { patchlist } from "$lib/stores/patch";

    /*--------------------------------- Props --------------------------------*/

    export let visible: boolean = true;

    let searchableList: SearchableList;

    /*-------------------------------- Methods -------------------------------*/

    function listTransform(list: string[]) {
        const dict: any = {};
        list.forEach((l) => {
            dict[l] = { icon: Document };
        });

        return dict;
    }

    /*------------------------------- Lifecycle ------------------------------*/

    $: if(visible) {
        if(searchableList) {
            if(searchableList.focus)
               searchableList?.focus();
        }
    }

    patch.subscribe((p) => {
        console.log(p);
    });
</script>


<BaseDialog title="Open Patch" icon={FolderOpen} bind:visible>
    <SearchableList bind:this={searchableList} items={listTransform($patchlist)}
        on:select={(s) => {
            console.log(s.detail);
            setTimeout(async () => {
                if(await patch.open(s.detail) === false) {
                    console.log("ERROR");
                }
                visible = false;
            }, 200);
        }}
    />
</BaseDialog>

