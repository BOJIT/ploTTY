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

     <h2>{$patch.key}</h2>

     <!-- TODO add bottom bar with filename + expand for debug -->
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
        position: absolute;
        z-index: 10;

        visibility: hidden;
        pointer-events: none;

        background-color: rgba(0, 0, 0, 0.281);
    }

    .controls {
        position: fixed;
        bottom: 2rem;
        right: 2rem;
        z-index: 20 ;
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

    /* TEMP */
    h2 {
        text-align: center;
        margin-top: 10rem;
    }
</style>
