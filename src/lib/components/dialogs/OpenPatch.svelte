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

    let selectorFilter: SelectorFilter;

    /*-------------------------------- Methods -------------------------------*/

    $: if(visible) {
        if(selectorFilter) {
            if(selectorFilter.focus)
               selectorFilter?.focus();
        }
    }

    /*------------------------------- Lifecycle ------------------------------*/

</script>


<BaseDialog title="Open Patch" icon={FolderOpen} bind:visible>
    <SelectorFilter bind:this={selectorFilter} items={{
        "New File 1": {
            description: "Hello There"
        },
        "The Scream": {
        },
        "TEST Myself": {
            description: "Hello There"
        },
        "Misc Thing": {
            description: "Hello There"
        },
        "Patch ME": {
            description: "Hello There"
        },
        "Fudge Brownie": {
            description: "Hello There"
        },
        "New Target": {
            description: "Hello World",
            icon: FolderOpen,
        },
    }} on:select={(s) => {
        console.log(s.detail);
        setTimeout(() => {
            visible = false;
        }, 200);
    }}/>
</BaseDialog>

