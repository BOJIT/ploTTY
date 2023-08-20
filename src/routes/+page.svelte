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

    import { message } from "@bojit/svelte-components/core";
    import { IconButton } from "@bojit/svelte-components/form";
    import { NavBar, type NavItem } from "@bojit/svelte-components/layout";
    import { mode as themeMode } from "@bojit/svelte-components/theme";

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
    import hardware from "$lib/stores/hardware";
    import logs from "$lib/stores/logs";
    import patch, { graph } from "$lib/stores/patch";
    import settings from "$lib/stores/settings";

    import runtime from "$lib/utils/runtime";

    // Components
    import Editor from "$lib/components/Editor.svelte";
    import KeyBindings from "$lib/components/KeyBindings.svelte";
    import Widgets from "$lib/components/Widgets.svelte";

    /*--------------------------------- Props --------------------------------*/

    let hideTooltips: boolean = true;

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

    let widgets: Widgets;

    /*-------------------------------- Methods -------------------------------*/

    /*------------------------------- Lifecycle ------------------------------*/

    graphRunning.subscribe((r) => {
        if (r === true) {
            console.log($graph.edges);
            runtime.start($graph);
        } else {
            runtime.stop();
        }
    });

    onMount(async () => {
        // Initialise local storage databases
        await settings.init();
        await hardware.init();
        await logs.init();
        await components.init();
        await patch.init();

        // Initialise runtime
        runtime.init((e: Error) => {
            $graphRunning = false; // Stop network
            console.error(e);
            message.push({
                title: "GraphError: ".concat(e.name),
                message: e.message,
                type: "error",
            });
        }, widgets);

        // Update settings store when theme changes
        $themeMode = $settings.theme;
        themeMode.subscribe((t) => {
            $settings.theme = t;
        });

        // HACK - fixes tooltips on mobile
        const mql = window.matchMedia("(max-width: 940px)");
        mql.onchange = (e) => {
            hideTooltips = e.matches;
        };
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
            label={hideTooltips
                ? "label"
                : $graphRunning
                ? "Stop [␣]"
                : "Start [␣]"}
            on:click={() => ($graphRunning = !$graphRunning)}
        />
        <IconButton
            icon={$editorOverlay ? BarChart : GitBranch}
            color={$editorOverlay
                ? "var(--color-primary-400)"
                : "var(--color-alert-400)"}
            size="1.75rem"
            label={hideTooltips
                ? "label"
                : $editorOverlay
                ? "Graph View [↹]"
                : "Editor View [↹]"}
            on:click={() => ($editorOverlay = !$editorOverlay)}
        />
    </div>
</NavBar>

<!-- Primary User Interface -->
<div class="interface">
    <Widgets bind:this={widgets} />
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
