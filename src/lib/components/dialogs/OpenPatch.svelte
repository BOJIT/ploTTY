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

    import { SearchableList } from "@bojit/svelte-components/form";
    import { BaseDialog } from "@bojit/svelte-components/layout";

    import {
        FolderOpen,
    } from "@svicons/ionicons-outline";

    /*--------------------------------- Props --------------------------------*/

    export let visible: boolean = true;

    let searchableList: SearchableList;

    /*-------------------------------- Methods -------------------------------*/

    $: if(visible) {
        if(searchableList) {
            if(searchableList.focus)
               searchableList?.focus();
        }
    }

    /*------------------------------- Lifecycle ------------------------------*/

</script>


<BaseDialog title="Open Patch" icon={FolderOpen} bind:visible>
    <SearchableList bind:this={searchableList} items={{
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

