<!--
 * @file NewPatch.svelte
 * @author James Bennion-Pedley
 * @brief New Patch Dialogue
 * @date 08/02/2023
 *
 * @copyright Copyright (c) 2023
 *
-->

<script lang="ts">
    /*-------------------------------- Imports -------------------------------*/

    import { writable, type Writable } from "svelte/store";

    import { message } from "@bojit/svelte-components/core";
    import { BaseDialog } from "@bojit/svelte-components/layout";
    import { Button, TextField } from "@bojit/svelte-components/smelte";

    import { Document } from "@svicons/ionicons-outline";

    // Stores
    import { editorOverlay } from "$lib/stores/overlays";
    import { graphRunning, nodeSelected } from "$lib/stores/runState";
    import patch from "$lib/stores/patch";

    /*--------------------------------- Props --------------------------------*/

    export let visible: boolean = true;

    let field: HTMLElement;
    let name: Writable<string> = writable("New Patch");

    /*-------------------------------- Methods -------------------------------*/

    async function newPatch() {
        if (patch.validName($name) === false) return;

        // Create a new file
        if ((await patch.create($name)) === false) {
            message.push({
                type: "error",
                title: "File Error",
                message: "Could not create file!",
                timeout: 5,
            });

            return;
        }

        // Stop editor, open file, then switch to graph view
        $graphRunning = false;
        await patch.open($name);

        // If success
        $editorOverlay = true;
        $nodeSelected = [];
        visible = false;
    }

    /*------------------------------- Lifecycle ------------------------------*/

    $: if (field) {
        let input = field.querySelector("input");
        if (visible) {
            $name = "New Patch";
            input?.focus();
            setTimeout(() => {
                input?.select();
            }, 100);
        }
    }
</script>

<BaseDialog title="New Patch" icon={Document} bind:visible on:enter={newPatch}>
    <div bind:this={field}>
        <TextField
            label="Patch Name"
            bind:value={$name}
            error={patch.validName($name) ? false : "Invalid Name"}
            color="secondary"
        />
    </div>

    <div slot="actions" class="dialog-actions">
        <Button color="alert" text on:click={() => (visible = false)}
            >Cancel</Button
        >
        <Button
            outlined
            color="success"
            disabled={!patch.validName($name)}
            on:click={newPatch}>Create</Button
        >
    </div>
</BaseDialog>

<style>
</style>
