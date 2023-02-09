<!--
 * @file Editor.svelte
 * @author James Bennion-Pedley
 * @brief Graph Editor View
 * @date 08/02/2023
 *
 * @copyright Copyright (c) 2023
 *
-->

<script lang='ts'>
    /*-------------------------------- Imports -------------------------------*/

    import patch from "$lib/stores/patch";

    /*--------------------------------- Props --------------------------------*/

    export let visible = false;

    /*-------------------------------- Methods -------------------------------*/

    /*------------------------------- Lifecycle ------------------------------*/

</script>


<div class="editor" class:visible >
    <!-- <TheGraph theme={$Theme} bind:graph={graph} bind:API={API} bind:state={state}
     on:graphChange={graphChanged} library={[]} /> -->

     <h2>{$patch.key}</h2>

     <!-- TODO add bottom bar with filename + expand for debug -->
</div>


<style>
    .editor {
        height: 100%;
        width: 100%;
        position: absolute;
        z-index: 10;

        visibility: hidden;

        background-color: rgba(0, 0, 0, 0.281)    }

    .editor.visible {
        visibility: visible;
    }

    /* TEMP */
    h2 {
        text-align: center;
        margin-top: 10rem;
    }
</style>
