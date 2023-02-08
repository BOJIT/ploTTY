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

    import {
        Duplicate,
    } from "@svicons/ionicons-outline";

    import BaseDialog from "./BaseDialog.svelte";

    /*--------------------------------- Props --------------------------------*/

    export let visible: boolean = true;

    /*-------------------------------- Methods -------------------------------*/

    /*------------------------------- Lifecycle ------------------------------*/

</script>


<BaseDialog title="Duplicate Patch" icon={Duplicate} bind:visible>
    <h4>Test</h4>
</BaseDialog>


<style>

</style>
