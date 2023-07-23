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

    import { message } from "@bojit/svelte-components/core";
    import { IconButton } from "@bojit/svelte-components/form";
    import { BaseDialog } from "@bojit/svelte-components/layout";
    import { TextField, List, ListItem } from "@bojit/svelte-components/smelte";
    import { CodeEditor } from "@bojit/svelte-components/widgets";

    import {
        ArrowForwardCircle,
        CodeSlash,
        List as ListIcon,
        Settings,
    } from "@svicons/ionicons-outline";

    import type SvelvetAPI from "$lib/components/svelvet-editor/SvelvetAPI.svelte";

    import type { PlottyPort, PlottyPortMode } from "$lib/types/plotty";
    import type { GraphNode } from "$lib/middlewares/fbp-graph/Types";

    import { nodeSelected } from "$lib/stores/runState";
    import { graph } from "$lib/stores/patch";

    import components, { type ComponentLibrary } from "$lib/stores/components";

    /*--------------------------------- Props --------------------------------*/

    export let visible: boolean = true;
    export let api: SvelvetAPI;

    let label: string = "";
    let nodeObject: GraphNode | undefined = undefined;
    const labelRegex = new RegExp("^[a-zA-Z0-9-]*$");

    /*-------------------------------- Methods -------------------------------*/

    function getInputsFromLibrary(
        lib: ComponentLibrary,
        component: string
    ): [string, PlottyPort][] {
        if (lib[component] === undefined) return [];
        if (lib[component].inPorts === undefined) return [];
        return Object.entries(lib[component].inPorts);
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

        if ($graph.nodes.some((n) => label === n.id))
            return "ID already taken!";

        return false;
    }

    /*------------------------------- Lifecycle ------------------------------*/

    nodeSelected.subscribe((node) => {
        label = node;
        if (node !== "") {
            let graphRef = $graph.nodes.find((n) => node === n.id);
            if (graphRef !== undefined) nodeObject = graphRef;
        } else {
            nodeObject = undefined;
            visible = false; // Settings hidden if multiple components selected
        }
    });
</script>

<BaseDialog title="Component Settings" icon={Settings} bind:visible>
    <h6>Label</h6>
    <form autocomplete="off" class="overflow" data-simplebar>
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
                    api.renameNode(nodeObject.id, label);
                }
            }}
            color="secondary"
        />
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
                            $graph = $graph; // Trigger store update
                        }}
                    />
                    <IconButton
                        icon={ListIcon}
                        shape="square"
                        size="1rem"
                        color={mode === "enum"
                            ? "var(--color-success-400)"
                            : "var(--color-success-trans-dark)"}
                        useRipple={false}
                        on:click={() => {
                            nodeObject.metadata.portConfig[i[0]].mode = "enum";
                            $graph = $graph; // Trigger store update

                            // Set default enum if not picked
                            if (
                                nodeObject.metadata.portConfig[i[0]]
                                    .chosenEnumeration === undefined &&
                                i[1].enumeration !== undefined
                            )
                                nodeObject.metadata.portConfig[
                                    i[0]
                                ].chosenEnumeration = i[1].enumeration[0];
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
                            nodeObject.metadata.portConfig[i[0]].mode =
                                "custom";
                            $graph = $graph; // Trigger store update
                        }}
                    />
                </div>
                {#if mode === "enum"}
                    {#if i[1].enumeration !== undefined}
                        {#if typeof i[1].enumeration === "function"}
                            {#await i[1].enumeration() then e}
                                <div class="enumeration">
                                    <List
                                        bind:value={nodeObject.metadata
                                            .portConfig[i[0]].chosenEnumeration}
                                        items={e}
                                    >
                                        <div
                                            slot="item"
                                            let:item
                                            on:keypress
                                            on:click={() => {
                                                nodeObject.metadata.portConfig[
                                                    i[0]
                                                ].chosenEnumeration = item;
                                                $graph = $graph; // Trigger store update
                                            }}
                                            class:enumeration-selected={item ===
                                                nodeObject.metadata.portConfig[
                                                    i[0]
                                                ].chosenEnumeration}
                                        >
                                            <ListItem>
                                                {item}
                                            </ListItem>
                                        </div>
                                    </List>
                                </div>
                            {/await}
                        {:else}
                            <div class="enumeration">
                                <List
                                    bind:value={nodeObject.metadata.portConfig[
                                        i[0]
                                    ].chosenEnumeration}
                                    items={i[1].enumeration}
                                >
                                    <div
                                        slot="item"
                                        let:item
                                        on:keypress
                                        on:click={() => {
                                            nodeObject.metadata.portConfig[
                                                i[0]
                                            ].chosenEnumeration = item;
                                            $graph = $graph; // Trigger store update
                                        }}
                                        class:enumeration-selected={item ===
                                            nodeObject.metadata.portConfig[i[0]]
                                                .chosenEnumeration}
                                    >
                                        <ListItem>
                                            {item}
                                        </ListItem>
                                    </div>
                                </List>
                            </div>
                        {/if}
                    {:else}
                        <h6 class="warn">No Enumerations Available!</h6>
                    {/if}
                {:else if mode === "custom"}
                    <CodeEditor
                        code={nodeObject.metadata.portConfig[i[0]]
                            .codeString !== undefined
                            ? nodeObject.metadata.portConfig[i[0]].codeString
                            : "return 0;"}
                        maxHeight="10rem"
                        lineNumbers={false}
                        on:save={(e) => {
                            try {
                                const exec = Function(`${e.detail}`);
                                nodeObject.metadata.portConfig[
                                    i[0]
                                ].codeString = e.detail;
                                $graph = $graph; // Trigger store update
                            } catch (err) {
                                nodeObject.metadata.portConfig[
                                    i[0]
                                ].codeString = "return 0";
                                message.push({
                                    type: "error",
                                    title: "Invalid JS Syntax!",
                                    message: "Port config is invalid",
                                    timeout: 5,
                                });
                            }
                        }}
                    />
                {/if}
            {/each}
        {/if}
    </form>
</BaseDialog>

<style>
    .overflow {
        padding-left: 4px;
        padding-right: 4px;
        padding-bottom: 4px;

        max-height: 70vh;
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

    .enumeration {
        background-color: rgba(206, 206, 206, 0.1);
    }

    .enumeration > :global(ul) {
        padding: 0px !important;
    }

    .enumeration .enumeration-selected {
        background-color: var(--color-secondary-trans-dark);
    }

    .warn {
        color: var(--color-alert-700);
        text-align: center;
    }

    :global(.mode-dark) .warn {
        color: var(--color-alert-400);
    }
</style>
