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

    import SelectorFilter from "$lib/components/SearchableList.svelte";

    import {
        FolderOpen,
    } from "@svicons/ionicons-outline";

    import BaseDialog from "./BaseDialog.svelte";

    /*--------------------------------- Props --------------------------------*/

    export let visible: boolean = true;

    /*-------------------------------- Methods -------------------------------*/

    /*------------------------------- Lifecycle ------------------------------*/

</script>


<BaseDialog title="Open Patch" icon={FolderOpen} bind:visible>
    <SelectorFilter items={{
        "New File 1": {
            description: "Hello There"
        },
        "The Scream": {
        },
        "TEST Myself": {
            description: "Hello There"
        },
    }}/>
</BaseDialog>


<style>

</style>
