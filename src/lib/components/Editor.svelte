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

    import NofloGraph from "$lib/middlewares/fbp-graph";
    import type { Graph as NofloGraphType } from "$lib/middlewares/fbp-graph/Graph";

    import {
        componentSelectedOverlay,
        extendedSettingsOverlay,
    } from "$lib/stores/overlays";
    import patch from "$lib/stores/patch";

    import { clickOutside } from "$lib/utils/clickoutside";

    import SvelvetEditor from "$lib/components/svelvet-editor/SvelvetEditor.svelte";

    /*--------------------------------- Props --------------------------------*/

    export let visible: boolean = false;

    const accentColour: string = "rgba(131, 137, 172, 0.527)";

    let editor: SvelvetEditor;
    let graph: NofloGraphType;

    /*-------------------------------- Methods -------------------------------*/

    /*------------------------------- Lifecycle ------------------------------*/

    patch.subscribe(async (p) => {
        // Deserialise graph
        graph = await NofloGraph.loadJSON(p.graph);
    });
</script>

<div class="editor" class:visible>
    <SvelvetEditor
        bind:this={editor}
        bind:graph
        theme={$theme}
        on:change={() => {
            console.log(graph.nodes); // TODO remove

            // Serialise graph
            $patch.graph = graph.toJSON();
        }}
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
        {$patch.key}<span class="statuspath"
            >{$componentSelectedOverlay ? "/-> " : ""}</span
        >
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
                editor.resetGraph();
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
    {#if $componentSelectedOverlay}
        <div transition:fly={{ y: 100 }}>
            <IconButton
                icon={Settings}
                shape="circle"
                color={$theme === "light"
                    ? accentColour
                    : "var(--color-gray-800)"}
            />
        </div>

        <div transition:fly={{ y: 100 }}>
            <IconButton
                icon={Trash}
                shape="circle"
                color={$theme === "light"
                    ? accentColour
                    : "var(--color-gray-800)"}
            />
        </div>
    {/if}

    <IconButton
        icon={Add}
        shape="circle"
        color={$theme === "light" ? accentColour : "var(--color-gray-800)"}
        on:click={() => {
            editor.addNode("test");
        }}
    />
    <IconButton
        icon={Scan}
        shape="circle"
        color={$theme === "light" ? accentColour : "var(--color-gray-800)"}
        on:click={() => {
            editor.fitGraph();
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
        }

        .statusbar h5 {
            max-width: calc(100vw - 6rem);
        }

        .controls {
            bottom: 6.9rem;
        }
    }
</style>
