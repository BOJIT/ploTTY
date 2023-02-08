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

    import { SelectorFilter } from "@bojit/svelte-components/form";

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
    <SelectorFilter items={[
        'test1',
        'test2',
    ]}/>
</BaseDialog>


<style>

</style>
