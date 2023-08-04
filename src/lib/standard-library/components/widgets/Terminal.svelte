<!--
 * @file Terminal.svelte
 * @author James Bennion-Pedley
 * @brief Terminal Widget
 * @date 05/06/2023
 *
 * @copyright Copyright (c) 2023
 *
-->

<script lang="ts">
    /*-------------------------------- Imports -------------------------------*/

    import { onDestroy, onMount } from "svelte";

    import theme from "@bojit/svelte-components/theme";
    import type { ThemeMode } from "@bojit/svelte-components/theme/theme";

    /* XTermJS */
    import type { Terminal } from "xterm";
    import "xterm/css/xterm.css";

    /*--------------------------------- Props --------------------------------*/

    let container: HTMLElement;
    let terminal: Terminal;
    let resizeObserver: ResizeObserver | null = null;

    let interval: any = null; // TODO remove!!!

    /*---------------------------- Helper Functions --------------------------*/

    function setTheme(t: ThemeMode) {
        if (t == "light") {
            terminal.options.theme = {
                foreground: "#2d2d2d",
                cursor: "#2d2d2d",
                background: "#00000000",
            };
        } else {
            terminal.options.theme = {
                foreground: "#f5f5f5",
                cursor: "#f5f5f5",
                background: "#00000000",
            };
        }
    }

    function clearTerminal() {
        terminal.clear();
    }

    /*-------------------------------- Methods -------------------------------*/

    export function post(message: any) {
        if (typeof message === "string") terminal?.write(message);
        // Send control messages as objects
        else if (typeof message == "object") {
            if (message.command === "clear") clearTerminal();
        }
    }

    export function get() {
        return {};
    }

    /*------------------------------- Lifecycle ------------------------------*/

    onMount(async () => {
        // XTerm cannot be server-side rendered
        const { Terminal } = await import("xterm");
        const { FitAddon } = await import("xterm-addon-fit");
        const { WebglAddon } = await import("xterm-addon-webgl");

        // Create Terminal
        terminal = new Terminal({
            theme: {
                background: "#00000000",
            },
            allowTransparency: true,
            convertEol: true, // TODO make configuration?,
            scrollback: 5000,
        });

        // Mount terminal with fit addon
        let fitAddon = new FitAddon();
        let webglAddon = new WebglAddon();
        webglAddon.onContextLoss((e) => {
            webglAddon.dispose();
        });

        terminal.loadAddon(fitAddon);
        terminal.loadAddon(webglAddon);
        terminal.open(container);

        fitAddon.fit();

        // Redraw on size change
        resizeObserver = new ResizeObserver(function (entries) {
            fitAddon?.fit();
        });
        resizeObserver.observe(container);
    });

    onDestroy(() => {
        resizeObserver?.unobserve(container);

        clearInterval(interval);
    });

    theme.subscribe((t) => {
        if (terminal !== undefined) setTheme(t);
    });

    // TODO add overlays:
    // - clear screen
    // - copy N lines
    // - break-out response pane (toggle)
    // - to bottom (scroll)
</script>

<div class="xterm-container" bind:this={container} />

<style>
    .xterm-container {
        margin: 0.5rem;
        width: 100%;
        height: 100%;
    }
</style>
