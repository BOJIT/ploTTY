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
    import {
        Checkbox,
        RadioButtonGroup,
        TextField,
    } from "@bojit/svelte-components/smelte";

    import {
        Checkmark,
        ChevronDown,
        CloseCircle,
        Copy,
        Enter,
        EllipsisVertical,
        Exit,
    } from "@svicons/ionicons-outline";

    /* XTermJS */
    import type { Terminal } from "xterm";
    import "xterm/css/xterm.css";

    // User-preference settings are not instance-specific, so aren't stored in the Graph
    import settings from "$lib/stores/settings";
    import { graphRunning } from "$lib/stores/runState";

    import { clickOutside } from "$lib/utils/clickoutside";

    /*--------------------------------- Props --------------------------------*/

    let container: HTMLElement;
    let terminal: Terminal;
    let resizeObserver: ResizeObserver | null = null;

    let lineValue: string = "";
    let lineComponent: HTMLFormElement;

    let optionsDialog: boolean = false;

    // User Options
    const DEFAULT_CONFIG: {
        lineEntry: boolean;
        sendCRLF: boolean;
        copyMode: "line" | "screen" | "buffer" | "n-lines";
    } = {
        lineEntry: false,
        sendCRLF: true,
        copyMode: "buffer",
    };

    let terminalConfig = DEFAULT_CONFIG;
    let configLoaded: boolean = false;
    let copyIcon = Copy;

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

    $: {
        // // Write changes back to config
        // if (configLoaded && $settings.widgetConfig)
        //     $settings.widgetConfig.terminal = terminalConfig;
    }

    $: {
        // Disable keyboard interactions when line entry is visible
        if (terminal) terminal.options.disableStdin = terminalConfig.lineEntry;
    }

    onMount(async () => {
        // Populate settings fields if not present
        if ($settings.widgetConfig === undefined) $settings.widgetConfig = {};

        if ($settings.widgetConfig.terminal === undefined)
            $settings.widgetConfig.terminal = DEFAULT_CONFIG;

        terminalConfig = $settings.widgetConfig.terminal;
        configLoaded = true;

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
            if (!$graphRunning) return;
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
</script>

<div class="xterm-container">
    <div
        class="xterm-terminal"
        class:line-entry={terminalConfig.lineEntry}
        bind:this={container}
    />
    <div class="control-anchor">
        {#if terminalConfig.lineEntry}
            <form
                class="line-overlay overlay"
                autocomplete="off"
                transition:fly={{ x: -100 }}
                bind:this={lineComponent}
            >
                <TextField
                    bind:value={lineValue}
                    outlined
                    on:change={(e) => {
                        if (!$graphRunning) return;

                        if (terminalConfig.sendCRLF)
                            postToGraph(`${lineValue}\r\n`);
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
        <div class="control-overlay overlay">
            <IconButton
                size="2rem"
                icon={terminalConfig.lineEntry ? Exit : Enter}
                color="transparent"
                on:click={() => {
                    terminalConfig.lineEntry = !terminalConfig.lineEntry;
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
            <IconButton
                size="2rem"
                icon={copyIcon}
                color="transparent"
                on:click={() => {
                    switch (terminalConfig.copyMode) {
                        case "line": {
                            let lastline = terminal.buffer.active.cursorY;
                            terminal.selectLines(lastline, lastline);
                            if (
                                terminal
                                    .getSelection()
                                    .replace(
                                        /[\u0000-\u001F\u007F-\u009F]/g,
                                        ""
                                    ) === ""
                            ) {
                                // last line was empty
                                terminal.selectLines(lastline - 1, lastline);
                            }
                            break;
                        }

                        case "screen": {
                            let lastline = terminal.buffer.active.length;
                            terminal.selectLines(
                                lastline - terminal.rows,
                                lastline
                            );
                            break;
                        }

                        case "buffer": {
                            terminal.selectAll();
                            break;
                        }
                    }
                    let data = terminal.getSelection();
                    terminal.clearSelection();
                    navigator.clipboard.writeText(data);
                    copyIcon = Checkmark;
                    setTimeout(() => {
                        copyIcon = Copy;
                    }, 3000);
                }}
            />
            <IconButton
                size="2rem"
                icon={EllipsisVertical}
                color="transparent"
                on:click={() => {
                    optionsDialog = !optionsDialog;
                }}
            />
        </div>
    </div>
    <div
        class="options-anchor"
        use:clickOutside
        on:click_outside={() => {
            optionsDialog = false;
        }}
    >
        {#if optionsDialog}
            <div class="options-overlay overlay" transition:fly={{ x: 100 }}>
                <p>Copy Mode</p>
                <RadioButtonGroup
                    name="test"
                    color="secondary"
                    items={[
                        { value: "line", label: "line" },
                        { value: "screen", label: "screen" },
                        { value: "buffer", label: "buffer" },
                    ]}
                    bind:selected={terminalConfig.copyMode}
                />
                <Checkbox
                    label="send CR/LF"
                    color="secondary"
                    bind:checked={terminalConfig.sendCRLF}
                />
            </div>
        {/if}
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

    .options-anchor {
        position: absolute;
        bottom: 5.2rem;
        right: 0.4rem;
        z-index: 9;
    }

    .overlay {
        background-color: rgba(75, 75, 75, 0.603);
        border-radius: 0.8rem;
    }

    .control-overlay {
        padding: 0.5rem;
        display: flex;
        gap: 0.25rem;
        z-index: 9;
    }

    .line-overlay {
        flex-grow: 1;
        padding: 0.5rem;
        z-index: 10;
    }

    .options-overlay {
        padding: 1rem;
        padding-right: 2rem;
        display: flex;
        flex-direction: column;
        justify-content: center;
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
