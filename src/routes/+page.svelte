<!--
 * @file +page.svelte
 * @author James Bennion-Pedley
 * @brief Main UI
 * @date 07/02/2023
 *
 * @copyright Copyright (c) 2023
 *
-->

<script lang="ts">
    /*-------------------------------- Imports -------------------------------*/

    import { onMount } from "svelte";

    import { IconButton } from "@bojit/svelte-components/form";
    import { NavBar, type NavItem } from "@bojit/svelte-components/layout";
    import { mode as themeMode } from "@bojit/svelte-components/theme";
    import { Tabs } from "@bojit/svelte-components/widgets";

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

    // Stores
    import {
        editorOverlay,
        newPatchOverlay,
        openPatchOverlay,
        duplicatePatchOverlay,
        settingsOverlay,
        burgerMenuOverlay,
    } from "$lib/stores/overlays";
    import { graphRunning } from "$lib/stores/runState";
    import components from "$lib/stores/components";
    import patch from "$lib/stores/patch";
    import settings from "$lib/stores/settings";

    // Components
    import Editor from "$lib/components/Editor.svelte";
    import KeyBindings from "$lib/components/KeyBindings.svelte";
    import Widget from "$lib/components/Widget.svelte";

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
            label: "New Patch [⇧ + N]",
            visibility: "desktop",
            callback: () => {
                $newPatchOverlay = true;
            },
        },
        {
            type: "button",
            color: "transparent",
            icon: FolderOpen,
            label: "Open Patch [⇧ + O]",
            visibility: "desktop",
            callback: () => {
                $openPatchOverlay = true;
            },
        },
        {
            type: "button",
            color: "transparent",
            icon: Duplicate,
            label: "Duplicate Patch [⇧ + D]",
            visibility: "desktop",
            callback: () => {
                $duplicatePatchOverlay = true;
            },
        },
        {
            type: "separator",
        },
        {
            type: "button",
            color: "transparent",
            icon: Settings,
            label: "[⌘ + ' ]",
            visibility: "desktop",
            callback: () => {
                $settingsOverlay = true;
            },
        },
        {
            type: "button",
            color: "transparent",
            icon: Menu,
            visibility: "mobile",
            callback: () => {
                $burgerMenuOverlay = true;
            },
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

    onMount(async () => {
        // Initialise local storage databases
        await settings.init();
        await components.init();
        await patch.init();

        // Update settings store when theme changes
        $themeMode = $settings.theme;
        themeMode.subscribe((t) => {
            $settings.theme = t;
        });
    });
</script>

<svelte:head>
    <title>ploTTY</title>
</svelte:head>

<!-- Main Navigation -->
<NavBar
    title="ploTTY"
    {logo}
    logoLink="https://github.com/BOJIT/ploTTY"
    themeOverride="dark"
    {items}
>
    <div slot="nav-right">
        <IconButton
            icon={$graphRunning ? Pause : Play}
            color={$graphRunning
                ? "var(--color-error-700)"
                : "var(--color-success-700)"}
            size="1.75rem"
            label={$graphRunning ? "Stop [␣]" : "Start [␣]"}
            on:click={() => ($graphRunning = !$graphRunning)}
        />
        <IconButton
            icon={$editorOverlay ? BarChart : GitBranch}
            color={$editorOverlay
                ? "var(--color-primary-400)"
                : "var(--color-alert-400)"}
            size="1.75rem"
            label={$editorOverlay ? "Graph View [↹]" : "Editor View [↹]"}
            on:click={() => ($editorOverlay = !$editorOverlay)}
        />
    </div>
</NavBar>

<!-- Primary User Interface -->
<div class="interface">
    <div class="pad">
        <Tabs {tabs} />
    </div>

    <!-- Placeholder TEMPORARY -->
    <Widget />

    <Editor visible={$editorOverlay} />
</div>

<!-- GLobal Overlays -->
<KeyBindings />

{#if import.meta.env.VITE_SHOW_UNSTABLE === "true"}
    <!-- Beta Banner -->
    <div class="beta">
        <h6>This is a beta release! Beware of breaking changes!</h6>
    </div>
{/if}

<style>
    :global(.app) {
        height: 100vh !important;
    }

    .interface {
        position: relative;
        width: 100%;
        flex-grow: 2;

        display: flex;
        flex-direction: column;
        overflow: hidden;
    }

    .pad {
        padding: 0.2rem;
    }

    .beta {
        position: fixed;
        text-align: center;
        bottom: 0px;
        width: 100%;
        z-index: 1000;
        padding: 0.2rem;
        color: black;

        background-color: rgba(204, 204, 127, 0.623);
    }

    .beta h6 {
        font-size: 0.8rem;
    }

    :global(.mode-dark) .beta {
        color: white;
        background-color: rgba(94, 94, 27, 0.425);
    }
</style>
