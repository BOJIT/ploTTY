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

    import { Settings } from "@svicons/ionicons-outline";

    import { nodeSelected } from "$lib/stores/runState";

    import patch from "$lib/stores/patch";

    /*--------------------------------- Props --------------------------------*/

    export let visible: boolean = true;

    let label: string = "";

    /*-------------------------------- Methods -------------------------------*/

    /*------------------------------- Lifecycle ------------------------------*/

    nodeSelected.subscribe((n) => {
        label = n;
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
</BaseDialog>

<style>
    .overflow {
        padding-left: 4px;
        padding-right: 4px;
        padding-bottom: 4px;
    }
</style>
