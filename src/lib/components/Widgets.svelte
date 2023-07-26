<!--
 * @file Widgets.svelte
 * @author James Bennion-Pedley
 * @brief Container for graphical widgets
 * @date 29/05/2023
 *
 * @copyright Copyright (c) 2023
 *
-->

<script lang="ts">
    /*-------------------------------- Imports -------------------------------*/

    import { derived } from "svelte/store";

    import { Tabs } from "@bojit/svelte-components/widgets";

    import { graphRunning } from "$lib/stores/runState";
    import { graph } from "$lib/stores/patch";
    import components from "$lib/stores/components";
    import type { Node } from "svelvet/dist/types/parser";
    import type { SvelteComponent } from "svelte";

    /*--------------------------------- Props --------------------------------*/

    const widgetNodes = derived([graph, components], ([g, c]) => {
        const w = g.nodes.filter((n) => {
            if (c[n.component] === undefined) return false;
            if (c[n.component].widget === undefined) return false;
            return true;
        });

        return w;
    });

    const widgetIds = derived(widgetNodes, (w) => {
        return w.map((n) => {
            return {
                label: n.id,
            };
        });
    });

    let activeIds: number = 0;

    const widgetHandles: { [key: string]: SvelteComponent } = {};

    /*-------------------------------- Methods -------------------------------*/

    function checkSelectedWidget(
        ids: { label: string }[],
        idx: number,
        w: Node
    ) {
        // If selection has been deleted, reset to entry 0
        if (ids[idx] === undefined) {
            activeIds = 0;
            return false;
        }

        return ids[idx].label === w.id;
    }

    /*---------------------------------- API ---------------------------------*/

    export function post(id: string, message: any) {
        if (widgetHandles[id] === undefined) return null;
        widgetHandles[id].post(message);
    }

    export function get(id: string) {
        if (widgetHandles[id] === undefined) return null;
        return widgetHandles[id].get();
    }

    /*------------------------------- Lifecycle ------------------------------*/
</script>

{#if $widgetNodes.length > 0}
    <div class="pad">
        <Tabs tabs={$widgetIds} bind:index={activeIds} />
    </div>
{/if}

<div class="widgets">
    {#if $widgetNodes.length === 0}
        <h2 class="no-widgets">[No Active Widgets]</h2>
    {/if}

    {#each $widgetNodes as w (w.id)}
        <div
            class="widget"
            class:visible={checkSelectedWidget($widgetIds, activeIds, w)}
        >
            <svelte:component
                this={$components[w.component].widget}
                bind:this={widgetHandles[w.id]}
            />
        </div>
    {/each}
</div>

<style>
    .pad {
        padding: 0.2rem;
    }

    .widgets {
        flex-grow: 2;
        display: grid;
        justify-items: center;
        align-items: center;

        position: relative;
    }

    .widget {
        position: absolute;
        visibility: hidden;

        width: 100%;
        height: 100%;
    }

    .visible {
        visibility: visible;
    }

    .no-widgets {
        color: rgba(135, 135, 135, 0.5);
    }

    @media screen and (max-width: 940px) {
        h2 {
            font-size: 2rem;
        }
    }
</style>
