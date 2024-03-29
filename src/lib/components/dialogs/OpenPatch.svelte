<!--
 * @file OpenPatch.svelte
 * @author James Bennion-Pedley
 * @brief Open Patch Dialogue
 * @date 08/02/2023
 *
 * @copyright Copyright (c) 2023
 *
-->

<script lang="ts">
    /*-------------------------------- Imports -------------------------------*/

    import { message } from "@bojit/svelte-components/core";
    import {
        SearchableList,
        TextIconButton,
    } from "@bojit/svelte-components/form";
    import theme from "@bojit/svelte-components/theme";
    import { BaseDialog } from "@bojit/svelte-components/layout";

    import {
        CloudDownload,
        CloudUpload,
        Document,
        FolderOpen,
        Trash,
    } from "@svicons/ionicons-outline";

    import type SvelvetAPI from "$lib/components/svelvet-editor/SvelvetAPI.svelte";

    // Stores
    import { editorOverlay } from "$lib/stores/overlays";
    import { graphRunning, nodeSelected } from "$lib/stores/runState";
    import patch, { patchlist } from "$lib/stores/patch";

    // Utils
    import file from "$lib/utils/file";

    /*--------------------------------- Props --------------------------------*/

    export let visible: boolean = true;
    export let api: SvelvetAPI;

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

    $: if (visible) {
        if (searchableList) {
            if (searchableList.focus) searchableList?.focus();
        }
    }
</script>

<BaseDialog title="Open Patch" icon={FolderOpen} bind:visible>
    <SearchableList
        bind:this={searchableList}
        items={listTransform($patchlist)}
        buttons={[CloudDownload, Trash]}
        on:select={(s) => {
            setTimeout(async () => {
                $graphRunning = false; // Stop curent network
                api.resetGraph(); // HACK: for edge mods

                if ((await patch.open(s.detail)) === false) {
                    message.push({
                        type: "error",
                        title: "File Error",
                        message: "Could not open file!",
                        timeout: 5,
                    });

                    return;
                }

                $editorOverlay = true;
                api.fitGraph();
                api.triggerEdgeSync(); // HACK: for edge mods

                $nodeSelected = [];
                visible = false;
            }, 200);
        }}
        on:button={async (e) => {
            if (e.detail.index === 0) {
                // Download
                let p = await patch.download(e.detail.key);
                if (p === null) return;

                file.download(p, `${file.validName(e.detail.key)}.plotty.json`);
            } else if (e.detail.index === 1) {
                // Delete
                if (e.detail.key === $patch.key) {
                    $graphRunning = false; // Stop curent network

                    if (!$patchlist.includes("Example Patch")) {
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

    <br />
    <div style="padding-left: 0.3rem">
        <TextIconButton
            icon={CloudUpload}
            label="Upload"
            outlined
            shape="rounded"
            color={$theme === "light" ? "black" : "white"}
            on:click={() => {
                file.upload(
                    async (f) => {
                        const status = await patch.upload(f);
                        if (status === null) {
                            message.push({
                                type: "error",
                                title: "Upload Error!",
                                message:
                                    "At least one uploaded file is corrupt!",
                                timeout: 5,
                            });
                        } else if (status === false) {
                            message.push({
                                type: "warning",
                                title: "Duplicate Name!",
                                message:
                                    "At least one file was renamed on upload.",
                                timeout: 5,
                            });
                        }
                    },
                    ".plotty.json",
                    true
                );
            }}
        />
    </div>
</BaseDialog>
