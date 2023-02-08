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

    import {
        Duplicate,
    } from "@svicons/ionicons-outline";

    import { Button, TextField } from "@bojit/svelte-components/smelte";

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

    function duplicatePatch() {
        if(nameValid() === false)
            return;

        console.log("Patch Duplicated!");

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


<BaseDialog title="Duplicate Patch" icon={Duplicate} bind:visible on:enter={duplicatePatch}>
    <div bind:this={field}>
        <TextField label="Patch Name" bind:value={$name}
            error={nameValid($name) ? false : "Invalid Name"}/>
    </div>

    <div slot="actions" class="dialog-actions">
        <Button color="alert" text on:click={() => visible = false}>Cancel</Button>
        <Button outlined color="success" disabled={!nameValid($name)}
        on:click={duplicatePatch}>Create</Button>
    </div>
</BaseDialog>


<style>

</style>
