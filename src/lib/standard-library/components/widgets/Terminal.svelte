<!--
 * @file Terminal.svelte
 * @author James Bennion-Pedley
 * @brief Terminal Widget
 * @date 05/06/2023
 *
 * @copyright Copyright (c) 2023
 *
-->
<svelte:options accessors={true} />

<script lang="ts">
    /*-------------------------------- Imports -------------------------------*/

    import { onDestroy, onMount } from "svelte";
    import { fly } from "svelte/transition";

    import theme from "@bojit/svelte-components/theme";
    import type { ThemeMode } from "@bojit/svelte-components/theme/theme";
    import { IconButton } from "@bojit/svelte-components/form";
    import { TextField } from "@bojit/svelte-components/smelte";

    import {
        ChevronDown,
        CloseCircle,
        Copy,
        Enter,
        Exit,
    } from "@svicons/ionicons-outline";

    /* XTermJS */
    import type { Terminal } from "xterm";
    import "xterm/css/xterm.css";

    /*--------------------------------- Props --------------------------------*/

    let container: HTMLElement;
    let terminal: Terminal;
    let resizeObserver: ResizeObserver | null = null;

    let lineEntry: boolean = false;
    let lineValue: string = "";
    let lineComponent: HTMLFormElement;

    // User Options
    let sendNewline = true;
    let copyMode: "last-line" | "screen" | "buffer" | "n-lines";
    let copyLines = 10;

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

    /*----------------------------- Graph Methods ----------------------------*/

    // Mandatory recv callback (call this to send to NoFlo)
    export let postToGraph = (m: any) => {
        return;
    };

    export function postFromGraph(message: any) {
        if (typeof message === "string") terminal?.write(message);
        // Send control messages as objects
        else if (typeof message == "object") {
            if (message.command === "clear") terminal.clear();
        }
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
        terminal.onData((d: string) => {
            postToGraph(d);
        });

        // Set initial theme and resize
        setTheme($theme);
        fitAddon.fit();

        // Redraw on size change
        resizeObserver = new ResizeObserver(function (entries) {
            fitAddon?.fit();
        });
        resizeObserver.observe(container);
    });

    onDestroy(() => {
        resizeObserver?.unobserve(container);
    });

    theme.subscribe((t) => {
        if (terminal !== undefined) setTheme(t);
    });

    // TODO add overlays:
    // - copy N lines
</script>

<div class="xterm-container">
    <div
        class="xterm-terminal"
        class:line-entry={lineEntry}
        bind:this={container}
    />
    <div class="control-anchor">
        {#if lineEntry}
            <form
                class="line-overlay"
                autocomplete="off"
                transition:fly={{ x: -100 }}
                bind:this={lineComponent}
            >
                <TextField
                    bind:value={lineValue}
                    outlined
                    on:change={(e) => {
                        if (sendNewline) postToGraph(`${lineValue}\r\n`);
                        else postToGraph(lineValue);
                        lineValue = "";
                        let input = lineComponent.querySelector("input");
                        setTimeout(() => {
                            input?.focus();
                        }, 1);
                    }}
                />
            </form>
        {/if}
        <div class="control-overlay">
            <IconButton
                size="2rem"
                icon={lineEntry ? Exit : Enter}
                color="transparent"
                on:click={() => {
                    lineEntry = !lineEntry;
                }}
            />
            <IconButton
                size="2rem"
                icon={ChevronDown}
                color="transparent"
                on:click={() => {
                    terminal.scrollToBottom();
                }}
            />
            <IconButton
                size="2rem"
                icon={CloseCircle}
                color="transparent"
                on:click={() => {
                    terminal.clear();
                }}
            />
            <IconButton size="2rem" icon={Copy} color="transparent" />
        </div>
    </div>
</div>

<style>
    .xterm-container {
        padding: 0.5rem;
        width: 100%;
        height: 100%;

        position: relative;
    }

    .xterm-terminal {
        width: 100%;
        height: 100%;
    }

    .xterm-terminal.line-entry {
        height: calc(100% - 5rem);
    }

    .control-anchor {
        position: absolute;
        bottom: 0.4rem;
        left: 0.4rem;
        right: 0.4rem;

        display: flex;
        gap: 0.5rem;
        justify-content: flex-end;
    }

    .control-overlay {
        background-color: rgba(75, 75, 75, 0.603);
        border-radius: 0.8rem;

        padding: 0.5rem;
        display: flex;
        gap: 0.25rem;
        z-index: 9;
    }

    .line-overlay {
        background-color: rgba(75, 75, 75, 0.603);
        border-radius: 0.8rem;

        flex-grow: 1;
        padding: 0.5rem;
        z-index: 10;
    }

    .line-overlay > :global(div) {
        margin: 0px;
    }

    .line-overlay :global(input) {
        max-height: 3.4rem;
    }

    :global(.mode-dark) .control-overlay {
        background-color: var(--color-gray-trans-light);
    }
</style>
