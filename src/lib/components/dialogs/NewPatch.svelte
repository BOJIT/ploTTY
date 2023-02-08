<!--
 * @file NewPatch.svelte
 * @author James Bennion-Pedley
 * @brief New Patch Dialogue
 * @date 08/02/2023
 *
 * @copyright Copyright (c) 2023
 *
-->

<script lang='ts'>
    /*-------------------------------- Imports -------------------------------*/

    import { writable, type Writable } from "svelte/store";

    import { Button, TextField } from "@bojit/svelte-components/smelte";

    import {
        Document,
    } from "@svicons/ionicons-outline";

    import BaseDialog from "./BaseDialog.svelte";

    /*--------------------------------- Props --------------------------------*/

    export let visible: boolean = true;

    let field: HTMLElement;
    let name: Writable<string> = writable("New Patch");

    /*-------------------------------- Methods -------------------------------*/

    function nameValid() {
        if($name === "")
            return false;

        return true;
    }

    function newPatch() {
        if(nameValid() === false)
            return;

        console.log("Patch Created!");

        // If success
        visible = false;
    }

    /*------------------------------- Lifecycle ------------------------------*/

    $: if(field) {
        let input = field.querySelector('input');
        if(visible) {
            $name = "New Patch";
            input?.focus();
            setTimeout(() => {
                input?.select();
            }, 100)
        }
    }
</script>


<BaseDialog title="New Patch" icon={Document} bind:visible on:enter={newPatch}>
    <div bind:this={field}>
        <TextField label="Patch Name" bind:value={$name}
            error={nameValid($name) ? false : "Invalid Name"}/>
    </div>

    <div slot="actions" class="dialog-actions">
        <Button color="alert" text on:click={() => visible = false}>Cancel</Button>
        <Button outlined color="success" disabled={!nameValid($name)}
        on:click={newPatch}>Create</Button>
    </div>
</BaseDialog>


<style>

</style>
