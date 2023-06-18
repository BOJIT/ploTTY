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

    import type { Graph as NofloGraphType } from "$lib/middlewares/fbp-graph/Graph";

    import { BaseDialog } from "@bojit/svelte-components/layout";
    import { TextField } from "@bojit/svelte-components/smelte";
    import { CodeEditor } from "@bojit/svelte-components/widgets";

    import { Settings } from "@svicons/ionicons-outline";

    import { activeGraph, nodeSelected } from "$lib/stores/runState";

    /*--------------------------------- Props --------------------------------*/

    export let visible: boolean = true;

    let label: string = "";

    /*-------------------------------- Methods -------------------------------*/

    /*------------------------------- Lifecycle ------------------------------*/

    nodeSelected.subscribe((node) => {
        label = node;
        if (node !== "") {
            console.log("Selected");
            console.log(
                $activeGraph.nodes.find((n) => {
                    node === n.id;
                })
            );
        }
    });
</script>

<BaseDialog title="Component Settings" icon={Settings} bind:visible>
    <h6>Label</h6>
    <form autocomplete="off" class="overflow">
        <TextField
            outlined
            prepend="label"
            bind:value={label}
            color="secondary"
            error={false}
        />
    </form>
    <h6>Ports</h6>
    <CodeEditor code={"let input = {\n\n};"} maxHeight="10rem" />
</BaseDialog>

<style>
    .overflow {
        padding-left: 4px;
        padding-right: 4px;
        padding-bottom: 4px;
    }
</style>
