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

    import { IconButton } from "@bojit/svelte-components/form";
    import { BaseDialog } from "@bojit/svelte-components/layout";
    import { TextField } from "@bojit/svelte-components/smelte";
    import { CodeEditor } from "@bojit/svelte-components/widgets";

    import {
        ArrowForwardCircle,
        CodeSlash,
        List,
        Settings,
    } from "@svicons/ionicons-outline";

    import type { PlottyPortMode } from "$lib/types/plotty";
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
    ): [string, object][] {
        if (lib[component] === undefined) return [];
        if (lib[component].inputs === undefined) return [];
        return Object.entries(lib[component].inputs);
    }

    function getPortMode(portName: string): PlottyPortMode {
        if (nodeObject === undefined) return "input";

        if (nodeObject.metadata.portConfig === undefined)
            nodeObject.metadata.portConfig = {};

        // Create default port config if doesn't exist
        if (nodeObject.metadata.portConfig[portName] === undefined) {
            nodeObject.metadata.portConfig[portName] = {
                mode: "input",
            };
        }

        return nodeObject.metadata.portConfig[portName].mode;
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
    {#if nodeObject !== undefined}
        <h6>Ports</h6>
        <hr />
        {#each getInputsFromLibrary($components, nodeObject.component) as i}
            {@const mode = getPortMode(i[0])}
            <div class="config">
                <h7 class="config-title">{i[0]}</h7>
                <IconButton
                    icon={ArrowForwardCircle}
                    shape="square"
                    size="1rem"
                    color={mode === "input"
                        ? "var(--color-primary-400)"
                        : "var(--color-primary-trans-dark)"}
                    useRipple={false}
                    on:click={() => {
                        nodeObject.metadata.portConfig[i[0]].mode = "input";
                        $activeGraph = $activeGraph; // Trigger store update
                    }}
                />
                <IconButton
                    icon={List}
                    shape="square"
                    size="1rem"
                    color={mode === "enum"
                        ? "var(--color-success-400)"
                        : "var(--color-success-trans-dark)"}
                    useRipple={false}
                    on:click={() => {
                        nodeObject.metadata.portConfig[i[0]].mode = "enum";
                        $activeGraph = $activeGraph; // Trigger store update
                    }}
                />
                <IconButton
                    icon={CodeSlash}
                    shape="square"
                    size="1rem"
                    color={mode === "custom"
                        ? "var(--color-alert-400)"
                        : "var(--color-alert-trans-dark)"}
                    useRipple={false}
                    on:click={() => {
                        nodeObject.metadata.portConfig[i[0]].mode = "custom";
                        $activeGraph = $activeGraph; // Trigger store update
                    }}
                />
            </div>
            {#if mode === "custom"}
                <CodeEditor code={"let input = {\n\n};"} maxHeight="10rem" />
            {/if}
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
</style>
