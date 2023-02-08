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

    import { editorOverlay, themeOverlay } from "$lib/stores/overlays";
    import { graphRunning } from "$lib/stores/runState";

    /*--------------------------------- Props --------------------------------*/

    /*-------------------------------- Methods -------------------------------*/

    function handleKeydown(event: KeyboardEvent) {
        // Are we in reserved dialogues?
        if($themeOverlay === true)
            return;

        // Global controls
        if(event.key === 'Tab') {
            event.preventDefault();
            $editorOverlay = !$editorOverlay;
        } else if(event.key === ' ') {
            $graphRunning = !$graphRunning;
        } else {
            // Unhandled case
            console.log(event);
        }
    }

    /*------------------------------- Lifecycle ------------------------------*/

</script>


<svelte:window on:keydown={handleKeydown}/>
