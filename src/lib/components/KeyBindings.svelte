<!--
 * @file KeyBindings.svelte
 * @author James Bennion-Pedley
 * @brief Handle all app keyboard shortcuts that are global scope
 * @date 08/02/2023
 *
 * @copyright Copyright (c) 2023
 *
-->

<script lang='ts'>
    /*-------------------------------- Imports -------------------------------*/

    import {
        editorOverlay,
        themeOverlay,
        newPatchOverlay,
        openPatchOverlay,
        duplicatePatchOverlay,
        settingsOverlay,
    } from "$lib/stores/overlays";
    import { graphRunning } from "$lib/stores/runState";

    /*--------------------------------- Props --------------------------------*/

    /*-------------------------------- Methods -------------------------------*/

    function handleKeydown(event: KeyboardEvent) {
        // modifier on its own does nothing
        if(event.key === 'Control')
            return;
        if(event.key === 'Meta')
            return;
        if(event.key === 'Shift')
            return;
        if(event.key === 'Enter')
            return;

        // Are we in reserved dialogues?
        if($themeOverlay === true)
            return;

        if($newPatchOverlay === true)
            return;

        if($openPatchOverlay === true)
            return;

        if($duplicatePatchOverlay === true)
            return;

        if($settingsOverlay === true)
            return;


        // Global controls
        if(event.key === 'Tab') {
            event.preventDefault();
            $editorOverlay = !$editorOverlay;
        } else if(event.key === ' ') {
            event.preventDefault();
            $graphRunning = !$graphRunning;
        } else if(event.shiftKey && (event.key === 'N')) {
            event.preventDefault();
            $newPatchOverlay = true;
        } else if(event.shiftKey && (event.key === 'O')) {
            event.preventDefault();
            $openPatchOverlay = true;
        } else if(event.shiftKey && (event.key === 'D')) {
            event.preventDefault();
            $duplicatePatchOverlay = true;
        } else if((event.ctrlKey || event.metaKey) && (event.key === '\'')) {
            event.preventDefault();
            $settingsOverlay = true;
        } else if((event.ctrlKey || event.metaKey) && (event.key === 's')) {
            event.preventDefault(); // Saving should not do anything!
        } else {
            // Unhandled case
            console.log(event);
        }
    }

    /*------------------------------- Lifecycle ------------------------------*/

</script>


<svelte:window on:keydown={handleKeydown}/>
