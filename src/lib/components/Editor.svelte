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

    import { fly } from 'svelte/transition';

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
        componentSelectedOverlay,
        extendedSettingsOverlay,
    } from "$lib/stores/overlays";
    import patch from "$lib/stores/patch";

    /*--------------------------------- Props --------------------------------*/

    export let visible = false;

    /*-------------------------------- Methods -------------------------------*/

    /*------------------------------- Lifecycle ------------------------------*/

</script>


<div class="editor" class:visible>
    <!-- <TheGraph theme={$Theme} bind:graph={graph} bind:API={API} bind:state={state}
     on:graphChange={graphChanged} library={[]} /> -->

     <!-- TODO add bottom bar with filename + expand for debug -->
</div>

<div class="statusbar" class:visible style:color={$theme === 'light' ? "var(--color-secondary-400)" : "var(--color-gray-800)"}>
    <h5>{$patch.key}<span class="statuspath">{$componentSelectedOverlay ? "/-> " : ""}</span></h5>
</div>

{#if $extendedSettingsOverlay}
    <div class="controls extended" class:visible transition:fly|local="{{ x:100 }}">
        <IconButton icon={Close} shape="circle"
            color={$theme === 'light' ? "var(--color-error-300)" : "var(--color-error-500)"}
        />
        <IconButton icon={ColorWand} shape="circle"
            color={$theme === 'light' ? "var(--color-secondary-400)" : "var(--color-gray-800)"}
        />
        <IconButton icon={ArrowUndo} shape="circle"
        color={$theme === 'light' ? "var(--color-secondary-400)" : "var(--color-gray-800)"}
        />
        <IconButton icon={ArrowRedo} shape="circle"
            color={$theme === 'light' ? "var(--color-secondary-400)" : "var(--color-gray-800)"}
        />
    </div>
{/if}

<div class="controls" class:visible>
    {#if $componentSelectedOverlay}
        <div transition:fly="{{ y:100 }}">
            <IconButton icon={Settings} shape="circle"
                color={$theme === 'light' ? "var(--color-secondary-400)" : "var(--color-gray-800)"}
            />
        </div>

        <div transition:fly="{{ y:100 }}">
            <IconButton icon={Trash} shape="circle"
                color={$theme === 'light' ? "var(--color-secondary-400)" : "var(--color-gray-800)"}
            />
        </div>
    {/if}

    <IconButton icon={Add} shape="circle"
        color={$theme === 'light' ? "var(--color-secondary-400)" : "var(--color-gray-800)"}
        on:click={() => {
            $componentSelectedOverlay = !$componentSelectedOverlay;
        }}
    />
    <IconButton icon={Scan} shape="circle"
        color={$theme === 'light' ? "var(--color-secondary-400)" : "var(--color-gray-800)"}
    />
    <IconButton icon={EllipsisHorizontal} shape="circle"
        color={$theme === 'light' ? "var(--color-secondary-400)" : "var(--color-gray-800)"}
        on:click={() => {
            $extendedSettingsOverlay = !$extendedSettingsOverlay;
        }}
    />
</div>

<style>
    .editor {
        height: 100%;
        width: 100%;
        position: fixed;
        z-index: 10;

        visibility: hidden;
        pointer-events: none;

        background-color: rgba(0, 0, 0, 0.281);
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

        background-color: rgba(100, 112, 180, 0.527);
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
        }

        .statusbar h5 {
            max-width: calc(100vw - 6rem);
        }

        .controls {
            bottom: 6.9rem;
        }
    }
</style>
