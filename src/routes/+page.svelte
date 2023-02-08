<!--
 * @file +page.svelte
 * @author James Bennion-Pedley
 * @brief Brief summary here
 * @date 07/02/2023
 *
 * @copyright Copyright (c) 2023
 *
-->

<script lang='ts'>
    /*-------------------------------- Imports -------------------------------*/

    import { NavBar, type NavItem } from "@bojit/svelte-components/layout";
    import { Tabs } from "@bojit/svelte-components/widgets";

    import { IconButton } from "@bojit/svelte-components/form";

    import {
        BarChart,
        Document,
        Duplicate,
        FolderOpen,
        GitBranch,
        Menu,
        Pause,
        Play,
        Settings,
     } from "@svicons/ionicons-outline";

    import logo from "$lib/assets/img/Logo.png";

    import Editor from "$lib/components/Editor.svelte";

    import { editorOverlay } from "$lib/stores/overlays";
    import { graphRunning } from "$lib/stores/runState";
    import KeyBindings from "$lib/components/KeyBindings.svelte";

    /*--------------------------------- Props --------------------------------*/

    let items: NavItem[] = [
        {
            type: "separator",
            visibility: "desktop",
        },
        {
            type: "button",
            color: "transparent",
            icon: Document,
            label: "New Patch [⌘ + N]",
            visibility: "desktop",
        },
        {
            type: "button",
            color: "transparent",
            icon: FolderOpen,
            label: "Open Patch [⌘ + O]",
            visibility: "desktop",
        },
        {
            type: "button",
            color: "transparent",
            icon: Duplicate,
            label: "Duplicate Patch",
            visibility: "desktop",
        },
        {
            type: "separator",
        },
        {
            type: "button",
            color: "transparent",
            icon: Settings,
            label: "Config",
            visibility: "desktop",
        },
        {
            type: "button",
            color: "transparent",
            icon: Menu,
            visibility: "mobile",
        },
    ];

    let tabs = [
        {
            label: "Plot 1",
        },
        {
            label: "Plot 2",
        },
    ];

    /*-------------------------------- Methods -------------------------------*/

    /*------------------------------- Lifecycle ------------------------------*/

</script>


<svelte:head>
    <title>ploTTY</title>
</svelte:head>


<!-- Main Navigation -->
<NavBar
    title="ploTTY"
    logo={logo}
    logoLink="https://github.com/BOJIT/ploTTY"
    themeOverride="dark"
    items={items}
>
    <div slot="nav-right">
        <IconButton
            icon={$graphRunning ? Pause : Play}
            color={$graphRunning ? "var(--color-error-700)" : "var(--color-success-700)"}
            size="1.75rem"
            label={$graphRunning ? "Stop [␣]" : "Start [␣]"}
            on:click={() => $graphRunning = !$graphRunning}
        />
        <IconButton
            icon={$editorOverlay ? BarChart : GitBranch}
            color={$editorOverlay ? "var(--color-primary-400)" : "var(--color-alert-400)"}
            size="1.75rem"
            label={$editorOverlay ? "Graph View [↹]" : "Editor View [↹]"}
            on:click={() => $editorOverlay = !$editorOverlay}
        />
    </div>
</NavBar>

<!-- Panel Tabs -->
<div class="pad">
    <Tabs tabs={tabs}/>
</div>

<Editor visible={$editorOverlay}/>

<KeyBindings />

<style>
    .pad {
        padding: 0.2rem;
    }
</style>
