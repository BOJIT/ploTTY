<!--
 * @file Editor.svelte
 * @author James Bennion-Pedley
 * @brief Graph Editor View
 * @date 08/02/2023
 *
 * @copyright Copyright (c) 2023
 *
-->

<script lang="ts">
    /*-------------------------------- Imports -------------------------------*/

    import { fly } from "svelte/transition";

    import { IconButton } from "@bojit/svelte-components/form";
    import theme from "@bojit/svelte-components/theme";

    import {
        Add,
        ArrowRedo,
        ArrowUndo,
        Close,
        ColorWand,
        EllipsisHorizontal,
        Scan,
        Settings,
        Trash,
    } from "@svicons/ionicons-outline";

    import {
        newPatchOverlay,
        openPatchOverlay,
        duplicatePatchOverlay,
        settingsOverlay,
        burgerMenuOverlay,
        extendedSettingsOverlay,
        addComponentOverlay,
        componenSettingsOverlay,
    } from "$lib/stores/overlays";
    import { nodeSelected } from "$lib/stores/runState";
    import patch, { graph } from "$lib/stores/patch";
    import settings from "$lib/stores/settings";

    import { clickOutside } from "$lib/utils/clickoutside";

    import SvelvetEditor from "$lib/components/svelvet-editor/SvelvetEditor.svelte";
    import type SvelvetAPI from "$lib/components/svelvet-editor/SvelvetAPI.svelte";

    import AddComponent from "$lib/components/dialogs/AddComponent.svelte";
    import BurgerMenu from "$lib/components/dialogs/BurgerMenu.svelte";
    import ComponentSettings from "$lib/components/dialogs/ComponentSettings.svelte";
    import DuplicatePatch from "$lib/components/dialogs/DuplicatePatch.svelte";
    import NewPatch from "$lib/components/dialogs/NewPatch.svelte";
    import OpenPatch from "$lib/components/dialogs/OpenPatch.svelte";
    import SettingsDialog from "$lib/components/dialogs/Settings.svelte";

    /*--------------------------------- Props --------------------------------*/

    export let visible: boolean = false;

    const accentColour: string = "rgba(131, 137, 172, 1)";

    let api: SvelvetAPI;

    /*-------------------------------- Methods -------------------------------*/

    function handleKeydown(event: KeyboardEvent) {
        // Only handle editor-specific events here
        if ($nodeSelected.length > 0 && $componenSettingsOverlay === false) {
            if (event.key === "Backspace") {
                event.preventDefault();
                $nodeSelected.forEach((n) => api.removeNode(n));
            }
        }
    }

    export function initialRender() {
        // This is messy...
        api.fitGraph();
        api.triggerEdgeSync(); // HACK: for edge mods
    }

    /*------------------------------- Lifecycle ------------------------------*/
</script>

<svelte:window on:keydown={handleKeydown} />

<div
    class="editor"
    class:visible
    class:low-graphics={$settings.switches.lowGraphicsMode}
>
    <SvelvetEditor
        bind:api
        bind:graph={$graph}
        bind:nodeSelected={$nodeSelected}
        theme={$theme}
    />
</div>

<div
    class="statusbar"
    class:visible
    style:color={$theme === "light"
        ? "var(--color-secondary-400)"
        : "var(--color-gray-800)"}
>
    <h5>
        {$patch.key}<span class="statuspath">
            {$nodeSelected.length === 1 ? `/${$nodeSelected}` : ""}
        </span>
    </h5>
</div>

{#if $extendedSettingsOverlay}
    <div
        class="controls extended"
        class:visible
        transition:fly|local={{ x: 100 }}
        use:clickOutside
        on:click_outside={() => {
            setTimeout(() => {
                $extendedSettingsOverlay = false;
            }, 10);
        }}
    >
        <IconButton
            icon={Close}
            shape="circle"
            color={$theme === "light"
                ? "var(--color-error-300)"
                : "var(--color-error-500)"}
            on:click={() => {
                api.resetGraph();
            }}
        />
        <IconButton
            icon={ColorWand}
            shape="circle"
            color={$theme === "light" ? accentColour : "var(--color-gray-800)"}
        />
        <IconButton
            icon={ArrowUndo}
            shape="circle"
            color={$theme === "light" ? accentColour : "var(--color-gray-800)"}
        />
        <IconButton
            icon={ArrowRedo}
            shape="circle"
            color={$theme === "light" ? accentColour : "var(--color-gray-800)"}
        />
    </div>
{/if}

<div class="controls" class:visible>
    {#if $nodeSelected.length === 1}
        <div transition:fly={{ y: 100 }}>
            <IconButton
                icon={Settings}
                shape="circle"
                color={$theme === "light"
                    ? accentColour
                    : "var(--color-gray-800)"}
                on:click={() => {
                    $componenSettingsOverlay = true;
                }}
            />
        </div>

        <div transition:fly={{ y: 100 }}>
            <IconButton
                icon={Trash}
                shape="circle"
                color={$theme === "light"
                    ? accentColour
                    : "var(--color-gray-800)"}
                on:click={() => {
                    api.removeNode($nodeSelected[0]);
                }}
            />
        </div>
    {/if}

    <IconButton
        icon={Add}
        shape="circle"
        color={$theme === "light" ? accentColour : "var(--color-gray-800)"}
        on:click={() => {
            $addComponentOverlay = true;
        }}
    />
    <IconButton
        icon={Scan}
        shape="circle"
        color={$theme === "light" ? accentColour : "var(--color-gray-800)"}
        on:click={() => {
            api.fitGraph();
        }}
    />
    <IconButton
        icon={EllipsisHorizontal}
        shape="circle"
        color={$theme === "light" ? accentColour : "var(--color-gray-800)"}
        on:click={() => {
            if (!$extendedSettingsOverlay) $extendedSettingsOverlay = true;
        }}
    />
</div>

<!-- Editor Overlays -->
<NewPatch bind:visible={$newPatchOverlay} />
<OpenPatch bind:visible={$openPatchOverlay} {api} />
<DuplicatePatch bind:visible={$duplicatePatchOverlay} />
<SettingsDialog bind:visible={$settingsOverlay} />
<BurgerMenu bind:visible={$burgerMenuOverlay} />
<AddComponent
    bind:visible={$addComponentOverlay}
    on:add={(e) => {
        api.addNode(e.detail);
    }}
/>
<ComponentSettings bind:visible={$componenSettingsOverlay} {api} />

<style>
    .editor {
        position: absolute;
        top: 0;
        left: 0;
        bottom: 0;
        right: 0;
        z-index: 10;

        display: none;
        pointer-events: none;

        background-color: rgba(0, 0, 0, 0.281);
    }

    .editor.visible {
        display: block;
    }

    .statusbar {
        position: fixed;
        z-index: 20;
        bottom: 2rem;
        left: 2rem;

        width: 30rem;
        height: 3.9rem;
        border-radius: 20vmin;

        visibility: hidden;
        pointer-events: none;

        background-color: rgba(131, 137, 172, 0.527);
        border: 1px solid whitesmoke;

        display: flex;
        align-items: center;
        padding-left: 1.5rem;
        padding-left: 1.5rem;
    }

    :global(.mode-dark) .statusbar {
        background-color: rgba(99, 99, 99, 0.432);
        border: 1px solid whitesmoke;
    }

    .controls {
        position: fixed;
        bottom: 2rem;
        right: 2rem;
        z-index: 20;
        visibility: hidden;
        pointer-events: none;

        display: flex;
        flex-direction: column;
        gap: 1rem;
    }

    .controls.extended {
        right: 7rem;
        flex-direction: row;
    }

    .visible {
        visibility: visible;
        pointer-events: auto;
    }

    .statusbar h5 {
        overflow: hidden;
        max-width: 30ch;
        text-overflow: ellipsis;
        white-space: nowrap;
        font-family: "JetBrains Mono";
        text-align: center;
        color: white;
    }

    .statusbar .statuspath {
        color: yellow;
    }

    @media screen and (max-width: 940px) {
        .statusbar {
            width: calc(100vw - 4rem);
            height: 3rem;
        }

        .statusbar h5 {
            max-width: calc(100vw - 6rem);
            font-size: 1rem;
        }

        .controls {
            bottom: 5.9rem;
        }

        .controls.extended {
            right: 6rem;
        }

        /* HACK - saves updating the prop on every button */
        .controls :global(button) {
            width: 3rem;
            height: 3rem;
        }

        .controls :global(svg) {
            width: 1.6rem;
            height: 1.6rem;
        }
    }
</style>
