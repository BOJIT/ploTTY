<!--
 * @file Settings.svelte
 * @author James Bennion-Pedley
 * @brief Settings Dialogue
 * @date 08/02/2023
 *
 * @copyright Copyright (c) 2023
 *
-->

<script lang='ts'>
    /*-------------------------------- Imports -------------------------------*/

    import { Tabs } from "@bojit/svelte-components/widgets";

    import {
        Settings,
    } from "@svicons/ionicons-outline";

    import BaseDialog from "./BaseDialog.svelte";

    /*--------------------------------- Props --------------------------------*/

    export let visible: boolean = true;

    let tabs = [
        {
            label: "Global",
        },
        {
            label: "Components",
        },
        {
            label: "Logs",
        },
        {
            label: "About",
        },
    ];

    /*-------------------------------- Methods -------------------------------*/

    /*------------------------------- Lifecycle ------------------------------*/

</script>


<BaseDialog title="Settings" icon={Settings} bind:visible>
    <Tabs tabs={tabs}/>

    <h4>Test</h4>
</BaseDialog>


<style>

</style>
