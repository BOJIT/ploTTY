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
    import { Button } from "@bojit/svelte-components/smelte";

    import {
        CloudDownload,
        CloudUpload,
        Document,
        FolderOpen,
        Trash,
    } from "@svicons/ionicons-outline";

    // Stores
    import {
        editorOverlay,
    } from "$lib/stores/overlays";
    import {
        graphRunning,
    } from "$lib/stores/runState";
    import patch, { patchlist } from "$lib/stores/patch";
    import { key } from "localforage";

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
        buttons={[CloudDownload, Trash]}
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
        on:button={async (e) => {
            if(e.detail.index === 0) {
                // Download
            } else if(e.detail.index === 1) {
                // Delete
                if(e.detail.key === $patch.key) {
                    $graphRunning = false;  // Stop curent network

                    if(!($patchlist.includes("Example Patch"))) {
                        // Create default patch
                        await patch.create("Example Patch");
                    }

                    await patch.open("Example Patch");
                    $editorOverlay = true;
                }

                await patch.remove(e.detail.key);
            }

        }}
    />

    <br>
    <Button><div class="iconButton"><CloudUpload height="1.5rem"/>Upload</div></Button>
</BaseDialog>


<style>
    .iconButton {
        display: flex;
        gap: 0.7rem;
        padding: 0.2rem;
        margin-left: -0.4rem;
        align-items: center;
    }
</style>
