<!--
 * @file DuplicatePatch.svelte
 * @author James Bennion-Pedley
 * @brief Duplicate Patch Dialogue
 * @date 08/02/2023
 *
 * @copyright Copyright (c) 2023
 *
-->

<script lang='ts'>
    /*-------------------------------- Imports -------------------------------*/

    import { writable, type Writable } from "svelte/store";

    import { message } from "@bojit/svelte-components/core";
    import { BaseDialog } from "@bojit/svelte-components/layout";
    import { Button, TextField } from "@bojit/svelte-components/smelte";

    import {
        Duplicate,
    } from "@svicons/ionicons-outline";

    // Stores
    import {
        editorOverlay,
    } from "$lib/stores/overlays";
    import {
        graphRunning,
    } from "$lib/stores/runState";
    import patch from "$lib/stores/patch";

    /*--------------------------------- Props --------------------------------*/

    export let visible: boolean = true;

    let field: HTMLElement;
    let name: Writable<string> = writable("New Patch");

    /*-------------------------------- Methods -------------------------------*/

    async function duplicatePatch() {
        if(patch.validName($name) === false)
            return;

        // Create a new file
        if(await patch.create($name, $patch) === false) {
            message.push({
                type: 'error',
                title: 'File Error',
                message: 'Could not create file!',
                timeout: 5,
            });

            return;
        }

        // Stop editor, open file, then switch to graph view
        $graphRunning = false;
        await patch.open($name);
        $editorOverlay = true;

        // If success
        visible = false;
    }

    /*------------------------------- Lifecycle ------------------------------*/

    $: if(field) {
        let input = field.querySelector('input');
        if(visible) {
            $name = "Duplicate Patch";
            input?.focus();
            setTimeout(() => {
                input?.select();
            }, 100)
        }
    }
</script>


<BaseDialog title="Duplicate Patch" icon={Duplicate} bind:visible on:enter={duplicatePatch}>
    <div bind:this={field}>
        <TextField label="Patch Name" bind:value={$name}
            error={patch.validName($name) ? false : "Invalid Name"}/>
    </div>

    <div slot="actions" class="dialog-actions">
        <Button color="alert" text on:click={() => visible = false}>Cancel</Button>
        <Button outlined color="success" disabled={!patch.validName($name)}
        on:click={duplicatePatch}>Create</Button>
    </div>
</BaseDialog>


<style>

</style>
