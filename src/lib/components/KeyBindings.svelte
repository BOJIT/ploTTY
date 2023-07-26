<!--
 * @file KeyBindings.svelte
 * @author James Bennion-Pedley
 * @brief Handle all app keyboard shortcuts that are global scope
 * @date 08/02/2023
 *
 * @copyright Copyright (c) 2023
 *
-->

<script lang="ts">
    /*-------------------------------- Imports -------------------------------*/

    import {
        editorOverlay,
        themeOverlay,
        newPatchOverlay,
        openPatchOverlay,
        duplicatePatchOverlay,
        settingsOverlay,
        addComponentOverlay,
        componenSettingsOverlay,
    } from "$lib/stores/overlays";

    import { graphRunning, nodeSelected } from "$lib/stores/runState";

    /*--------------------------------- Props --------------------------------*/

    /*-------------------------------- Methods -------------------------------*/

    function handleKeydown(event: KeyboardEvent) {
        // modifier on its own does nothing
        if (event.key === "Control") return;
        if (event.key === "Meta") return;
        if (event.key === "Shift") return;
        if (event.key === "Enter") return;

        // Are we in reserved dialogues?
        if ($themeOverlay === true) return;

        if ($newPatchOverlay === true) return;

        if ($openPatchOverlay === true) return;

        if ($duplicatePatchOverlay === true) return;

        if ($settingsOverlay === true) return;

        if ($addComponentOverlay === true) return;

        if ($componenSettingsOverlay === true) return;

        // Global controls
        if (event.key === "Tab") {
            $editorOverlay = !$editorOverlay;
        } else if (event.key === " ") {
            $graphRunning = !$graphRunning;
        } else if (event.key === "a" && !(event.ctrlKey || event.metaKey)) {
            setTimeout(() => {
                $addComponentOverlay = true;
            }, 100);
        } else if (event.key === "p" && $nodeSelected.length === 1) {
            setTimeout(() => {
                $componenSettingsOverlay = true;
            }, 100);
        } else if (event.shiftKey && event.key === "N") {
            $newPatchOverlay = true;
        } else if (event.shiftKey && event.key === "O") {
            $openPatchOverlay = true;
        } else if (event.shiftKey && event.key === "D") {
            $duplicatePatchOverlay = true;
        } else if ((event.ctrlKey || event.metaKey) && event.key === "'") {
            $settingsOverlay = true;
        } else if ((event.ctrlKey || event.metaKey) && event.key === "s") {
            event.preventDefault(); // Saving should not do anything!
        } else {
            // Unhandled case
            // console.log(event);
            return;
        }

        event.preventDefault();
    }

    /*------------------------------- Lifecycle ------------------------------*/
</script>

<svelte:window on:keydown={handleKeydown} />
