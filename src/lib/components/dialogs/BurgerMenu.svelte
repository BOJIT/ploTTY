<!--
 * @file BurgerMenu.svelte
 * @author James Bennion-Pedley
 * @brief Overlay for mobile devices
 * @date 27/06/2023
 *
 * @copyright Copyright (c) 2023
 *
-->

<script lang="ts">
    /*-------------------------------- Imports -------------------------------*/

    import {
        Document,
        Duplicate,
        FolderOpen,
        Settings,
    } from "@svicons/ionicons-outline";

    import { Dialog } from "@bojit/svelte-components/smelte";
    import { TextIconButton } from "@bojit/svelte-components/form";

    // Stores
    import {
        newPatchOverlay,
        openPatchOverlay,
        duplicatePatchOverlay,
        settingsOverlay,
        burgerMenuOverlay,
    } from "$lib/stores/overlays";

    /*--------------------------------- Props --------------------------------*/

    export let visible = false;

    /*-------------------------------- Methods -------------------------------*/

    /*------------------------------- Lifecycle ------------------------------*/
</script>

<div class="scope">
    <Dialog
        bind:value={visible}
        classes="items-center z-50 rounded p-4 shadow dialog"
    >
        <div class="buttons">
            <TextIconButton
                icon={Document}
                color="gray"
                label="New Patch"
                on:click={() => {
                    $burgerMenuOverlay = false;
                    setTimeout(() => {
                        $newPatchOverlay = true;
                    }, 100);
                }}
            />
            <TextIconButton
                icon={FolderOpen}
                color="gray"
                label="Open Patch"
                on:click={() => {
                    $burgerMenuOverlay = false;
                    setTimeout(() => {
                        $openPatchOverlay = true;
                    }, 100);
                }}
            />
            <TextIconButton
                icon={Duplicate}
                color="gray"
                label="Duplicate Patch"
                on:click={() => {
                    $burgerMenuOverlay = false;
                    setTimeout(() => {
                        $duplicatePatchOverlay = true;
                    }, 100);
                }}
            />
            <TextIconButton
                icon={Settings}
                color="gray"
                label="Settings"
                on:click={() => {
                    $burgerMenuOverlay = false;
                    setTimeout(() => {
                        $settingsOverlay = true;
                    }, 100);
                }}
            />
        </div>
    </Dialog>
</div>

<style>
    .scope :global(.dialog) {
        background-color: var(--color-gray-trans-light);
    }
    .buttons {
        display: flex;
        flex-direction: column;
        gap: 0.5rem;
        min-width: 18rem;
    }

    .buttons > :global(button) {
        padding-top: 0.7rem;
        padding-bottom: 0.7rem;
    }
</style>
