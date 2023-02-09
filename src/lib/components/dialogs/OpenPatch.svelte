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

    import { message } from "@bojit/svelte-components/core";
    import { SearchableList } from "@bojit/svelte-components/form";
    import { BaseDialog } from "@bojit/svelte-components/layout";

    import {
        Document,
        FolderOpen,
    } from "@svicons/ionicons-outline";

    // Stores
    import {
        editorOverlay,
    } from "$lib/stores/overlays";
    import {
        graphRunning,
    } from "$lib/stores/runState";
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
</script>


<BaseDialog title="Open Patch" icon={FolderOpen} bind:visible>
    <SearchableList bind:this={searchableList} items={listTransform($patchlist)}
        on:select={(s) => {
            setTimeout(async () => {
                $graphRunning = false;  // Stop curent network

                if(await patch.open(s.detail) === false) {
                    message.push({
                        type: 'error',
                        title: 'File Error',
                        message: 'Could not open file!',
                        timeout: 5,
                    });

                    return;
                }

                $editorOverlay = true;
                visible = false;
            }, 200);
        }}
    />
</BaseDialog>

