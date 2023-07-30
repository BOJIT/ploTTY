<!--
 * @file SvelvetNode.svelte
 * @author James Bennion-Pedley
 * @brief UI rendering of a node
 * @date 29/05/2023
 *
 * @copyright Copyright (c) 2023
 *
-->

<script lang="ts">
    /*-------------------------------- Imports -------------------------------*/

    import { getContext, type SvelteComponent } from "svelte";

    import { Node, Anchor, type CSSColorString } from "svelvet";

    import { ExtensionPuzzle as DefaultIcon } from "@svicons/ionicons-outline";

    import type { PlottyPortConfig } from "$lib/types/plotty";

    /*--------------------------------- Props --------------------------------*/

    export let id: string;
    export let position:
        | {
              x: number;
              y: number;
          }
        | undefined;
    export let icon: typeof SvelteComponent = DefaultIcon;
    export let colour: CSSColorString | undefined = undefined;
    export let label: string = "Default Node";

    export let inports: string[] = [];
    export let outports: string[] = [];

    export let portConfig: PlottyPortConfig | undefined = undefined;

    const graph = getContext("graph");
    const scale = graph.transforms.scale;

    let height: number = 100;
    const anchorSpacing: number = 15 + 12; // 15px Gap + 12px width

    /*-------------------------------- Methods -------------------------------*/

    /*------------------------------- Lifecycle ------------------------------*/

    $: {
        const extraHeight = Math.max(inports.length, outports.length) - 3;
        height = extraHeight > 0 ? 100 + anchorSpacing * extraHeight : 100;
    }
</script>

<div />

<Node bind:id bind:position let:grabHandle let:selected width={100} {height}>
    <div use:grabHandle class:selected class="node" style="height: {height}px">
        <div class="slab">
            <div
                class="icon"
                class:colour={colour !== undefined}
                style:background-color={colour}
            >
                <svelte:component
                    this={icon}
                    height="70px"
                    color={selected ? "#5e6a6e" : "#c8ced0"}
                />
            </div>
        </div>
        <div class="ports inports">
            {#each inports as ip}
                <div class="port-annotation" class:visible={$scale > 0.8}>
                    {#if portConfig && portConfig[ip] !== undefined}
                        <Anchor
                            input
                            locked={portConfig[ip].mode !== "input"}
                            bgColor={portConfig[ip].mode === "enum"
                                ? "#8ac38c"
                                : portConfig[ip].mode === "custom"
                                ? "#fbae3d"
                                : null}
                        />
                    {:else}
                        <Anchor input />
                    {/if}
                    <p class="left">{ip}</p>
                </div>
            {/each}
        </div>
        <div class="ports outports">
            {#each outports as op}
                <div class="port-annotation" class:visible={$scale > 0.8}>
                    <Anchor output />
                    <p class="right">{op}</p>
                </div>
            {/each}
        </div>
    </div>
    {#if label !== ""}
        <div class="label">{label}</div>
    {/if}
</Node>

<style>
    .node {
        border-radius: 20px;
        border: 5px solid #444444;

        width: 100px;

        position: absolute;
        display: grid;
        place-items: center;

        user-select: none;
        justify-content: center;
        overscroll-behavior: auto;
        align-items: center;
        text-align: center;
    }

    .node:hover {
        border: 5px solid #555555;
    }

    .slab {
        grid-row: 1;
        grid-column: 1;

        width: 90px;
        height: 100%;

        position: relative;
    }

    .icon {
        position: absolute;
        top: 2px;
        left: 2px;

        width: calc(100% - 4px);
        height: calc(100% - 4px);
        border-radius: 13px;
        background-color: rgba(230, 238, 240, 0.94);
        transition: background-color 0.5s ease;

        display: grid;
        place-items: center;
    }

    .icon :global(svg) {
        transition: color 0.5s ease;
    }

    .icon.colour :global(svg) {
        opacity: 30%;
        filter: brightness(50%);
    }

    .ports {
        grid-row: 1;
        grid-column: 1;
        z-index: 1;

        position: relative;
        display: flex;
        flex-direction: column;
        gap: 15px;
    }

    .inports {
        justify-self: start;
        left: -13px;
    }

    .outports {
        justify-self: end;
        right: -13px;
    }

    .port-annotation {
        position: relative;
    }

    .port-annotation p {
        position: absolute;
        top: -2px;

        font-size: 4px;
        font-family: "JetBrains Mono";
        color: black;
        white-space: nowrap;
        opacity: 0;
        transition: opacity 0.6s;
    }

    .port-annotation.visible p {
        opacity: 1;
    }

    .port-annotation .left {
        text-align: left;
        left: 17px;
    }

    .port-annotation .right {
        text-align: right;
        right: 17px;
    }

    .label {
        background-color: rgba(100, 100, 100, 0.2);
        padding-top: 2px;
        padding-bottom: 3px;
        padding-left: 10px;
        padding-right: 10px;
        border-radius: 3vmin;

        font-size: 10px;
        font-family: "JetBrains Mono";
        white-space: nowrap;

        position: absolute;
        bottom: -30px;
    }

    :global(.selected .icon) {
        background-color: #d8e0e2ff;
    }
</style>
