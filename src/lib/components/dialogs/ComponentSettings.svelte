<!--
 * @file ComponentSettings.svelte
 * @author James Bennion-Pedley
 * @brief Edit properties of a specific component
 * @date 11/06/2023
 *
 * @copyright Copyright (c) 2023
 *
-->

<script lang="ts">
    /*-------------------------------- Imports -------------------------------*/

    import { BaseDialog } from "@bojit/svelte-components/layout";
    import { TextField } from "@bojit/svelte-components/smelte";
    import { CodeEditor } from "@bojit/svelte-components/widgets";

    import {
        ArrowForwardCircle,
        CodeSlash,
        List,
        Settings,
    } from "@svicons/ionicons-outline";

    import type { GraphNode } from "$lib/middlewares/fbp-graph/Types";

    import { activeGraph, nodeSelected } from "$lib/stores/runState";

    import components, { type ComponentLibrary } from "$lib/stores/components";

    /*--------------------------------- Props --------------------------------*/

    export let visible: boolean = true;

    let label: string = "";
    let nodeObject: GraphNode | undefined = undefined;
    const labelRegex = new RegExp("^[a-zA-Z0-9-]*$");

    /*-------------------------------- Methods -------------------------------*/

    function getInputsFromLibrary(
        lib: ComponentLibrary,
        component: string
    ): string[] {
        if (lib[component] === undefined) return [];
        if (lib[component].inputs === undefined) return [];
        return Object.keys(lib[component].inputs);
    }

    function validateLabel(label: string): string | false {
        if (label === nodeObject?.id) return false;

        if (!label.match(labelRegex)) return "Invalid ID!";

        if ($activeGraph.nodes.some((n) => label === n.id))
            return "ID already taken!";

        return false;
    }

    /*------------------------------- Lifecycle ------------------------------*/

    nodeSelected.subscribe((node) => {
        label = node;
        if (node !== "") {
            let graphRef = $activeGraph.nodes.find((n) => node === n.id);
            if (graphRef !== undefined) nodeObject = graphRef;
        } else {
            nodeObject = undefined;
        }
    });
</script>

<BaseDialog title="Component Settings" icon={Settings} bind:visible>
    <h6>Label</h6>
    <form autocomplete="off" class="overflow">
        <TextField
            outlined
            prepend="label"
            error={validateLabel(label)}
            bind:value={label}
            on:change={() => {
                if (nodeObject === undefined) return;

                if (validateLabel(label) !== false)
                    label = nodeObject.id; // Revert to previous
                else {
                    nodeObject.id = label;
                    $nodeSelected = nodeObject.id;
                    $activeGraph = $activeGraph; // Trigger store update
                }
            }}
            color="secondary"
        />
    </form>
    {#if nodeObject}
        <h6>Ports</h6>
        <hr />
        {#each getInputsFromLibrary($components, nodeObject.component) as i}
            <div class="config">
                <h7 class="config-title">{i}</h7>
                <div
                    class="config-icon"
                    style:background-color="var(--color-primary-400)"
                >
                    <ArrowForwardCircle width="2rem" />
                </div>
                <div
                    class="config-icon"
                    style:background-color="var(--color-success-400)"
                >
                    <List width="2rem" />
                </div>
                <div
                    class="config-icon"
                    style:background-color="var(--color-alert-400)"
                >
                    <CodeSlash width="2rem" />
                </div>
            </div>
            <CodeEditor code={"let input = {\n\n};"} maxHeight="10rem" />
        {/each}
    {/if}
</BaseDialog>

<style>
    .overflow {
        padding-left: 4px;
        padding-right: 4px;
        padding-bottom: 4px;
    }

    .config {
        margin-top: 1rem;
        margin-bottom: 0.5rem;
        display: flex;
        align-items: center;
        justify-content: flex-start;

        border: 1px solid black;
        border-radius: 2px;
    }

    :global(.mode-dark) .config {
        border-color: white;
    }

    .config-title {
        flex-grow: 1;
        padding-left: 0.7rem;
    }

    .config-icon {
        justify-self: flex-end;
        width: 2.5rem;
        height: 2.5rem;
        display: grid;
        place-items: center;
    }
</style>
