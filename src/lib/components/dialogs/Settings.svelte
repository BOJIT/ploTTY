<!--
 * @file Settings.svelte
 * @author James Bennion-Pedley
 * @brief Settings Dialogue
 * @date 08/02/2023
 *
 * @copyright Copyright (c) 2023
 *
-->

<script lang="ts">
    /*-------------------------------- Imports -------------------------------*/

    import { message } from "@bojit/svelte-components/core";
    import {
        IconButton,
        SearchableList,
        TextIconButton,
    } from "@bojit/svelte-components/form";
    import { BaseDialog } from "@bojit/svelte-components/layout";
    import { Switch } from "@bojit/svelte-components/smelte";
    import { Tabs } from "@bojit/svelte-components/widgets";
    import theme from "@bojit/svelte-components/theme";
    const mode = theme.Mode;

    import {
        Bluetooth,
        CheckmarkCircle,
        CloseCircle,
        CloudDownload,
        Contrast,
        Desktop,
        GameController,
        Location,
        Moon,
        MusicalNotes,
        Settings,
        Sunny,
        Terminal,
        Warning,
    } from "@svicons/ionicons-outline";

    import components from "$lib/stores/components";
    import hardware, { type HardwareType } from "$lib/stores/hardware";
    import logs from "$lib/stores/logs";
    import patch from "$lib/stores/patch";
    import settings from "$lib/stores/settings";

    import Logo from "$lib/assets/img/BOJIT_Square.png";

    /*--------------------------------- Props --------------------------------*/

    export let visible: boolean = true;

    const themes = [
        {
            theme: "light",
            icon: Sunny,
        },
        {
            theme: "dark",
            icon: Moon,
        },
        {
            theme: "auto",
            icon: Contrast,
        },
    ];

    const col = "rgba(120, 120, 120, 0.5)";
    const col_focus = "rgba(180, 180, 180, 0.5)";

    let tabs = [
        {
            label: "Global",
        },
        {
            label: "Hardware",
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

    let index = 0;
    let areYouSure = false;
    let permissions = {};

    /*-------------------------------- Methods -------------------------------*/

    function mod(n: number, m: number) {
        return ((n % m) + m) % m;
    }

    function handleKeydown(event: KeyboardEvent) {
        if (event.key === "Shift") return;

        if (event.shiftKey && event.key === "Tab") {
            event.preventDefault();
            index = mod(index - 1, tabs.length);
        } else if (event.key === "Tab") {
            event.preventDefault();
            index = mod(index + 1, tabs.length);
        }
    }

    async function addHardwarePermission(type: HardwareType) {
        try {
            await hardware.addDevice(type);
        } catch (error: any) {
            message.push({
                type: "error",
                title: "Hardware Error",
                message: error.message,
                timeout: 10,
            });
        }

        // In the case of non-store hardware (e.g. GPS), force store update
        $hardware = $hardware;
    }

    /*------------------------------- Lifecycle ------------------------------*/

    $: if (visible) {
        index = 0;
    }

    hardware.subscribe(async (h) => {
        permissions = await hardware.enumerateAccess($hardware);
    });
</script>

<svelte:window on:keydown={handleKeydown} />

<BaseDialog title="Settings" icon={Settings} bind:visible>
    <Tabs {tabs} bind:index fade>
        <!-- Global -->
        <div class="tab">
            <h5>Global Settings</h5>
            <hr />
            <h6 class="center">Select Theme</h6>
            <div class="themes center">
                {#each themes as t, i}
                    <IconButton
                        icon={t.icon}
                        color={$mode === t.theme ? col_focus : col}
                        size="3em"
                        disabled={$mode === t.theme}
                        on:click={() => {
                            $mode = t.theme;
                        }}
                        useRipple={false}
                    />
                {/each}
            </div>
            <br />
            <hr />
            <h6 class="center">Program Configuration</h6>
            <div class="switches">
                <Switch
                    label="clear widgets on start"
                    bind:value={$settings.switches.clearWidgetsOnStart}
                />
                <Switch
                    label="basic graphics mode"
                    bind:value={$settings.switches.lowGraphicsMode}
                />
            </div>

            <div class="themes center">
                <TextIconButton
                    icon={CloudDownload}
                    label="Export Config"
                    shape="rounded"
                    color="primary"
                    on:click={() => {
                        message.push({
                            type: "error",
                            title: "Not Supported!",
                            message: "This feature is not implemented!",
                            timeout: 10,
                        });
                    }}
                />
                <TextIconButton
                    icon={Warning}
                    label="Reset ploTTY"
                    shape="rounded"
                    outlined
                    color="error"
                    on:click={() => {
                        areYouSure = true;
                    }}
                />
            </div>
        </div>

        <!-- Hardware Permissions -->
        <div class="tab">
            <h5>Hardware Permissions</h5>
            <hr />
            <div class="add-hardware">
                <h6 style:padding-top="0.3rem">Add:</h6>
                {#if "serial" in navigator}
                    <IconButton
                        icon={Terminal}
                        size="1rem"
                        color={col}
                        label="Serial"
                        on:click={() => addHardwarePermission("serial")}
                    />
                {/if}
                {#if "bluetooth" in navigator}
                    <IconButton
                        icon={Bluetooth}
                        size="1rem"
                        color={col}
                        label="Bluetooth"
                        on:click={() => addHardwarePermission("bluetooth")}
                    />
                {/if}
                {#if "requestMIDIAccess" in navigator}
                    <IconButton
                        icon={MusicalNotes}
                        size="1rem"
                        color={col}
                        label="MIDI"
                        on:click={() => addHardwarePermission("midi")}
                    />
                {/if}
                <IconButton
                    icon={Desktop}
                    size="1rem"
                    color={col}
                    label="WebSocket"
                    on:click={() => addHardwarePermission("websocket")}
                />
                <IconButton
                    icon={GameController}
                    size="1rem"
                    color={col}
                    label="Gamepad"
                    on:click={() => addHardwarePermission("gamepad")}
                />
                <IconButton
                    icon={Location}
                    size="1rem"
                    color={col}
                    label="GPS"
                    on:click={() => addHardwarePermission("gps")}
                />
            </div>
            {#if Object.keys(permissions).length > 0}
                <SearchableList
                    items={permissions}
                    maxHeight="12rem"
                    on:button={(e) => {
                        if (e.detail.index == 0) {
                            // TODO launch rename dialogue
                            // hardware.renameDevice()
                        } else if (e.detail.index == 1) {
                            hardware.removeDevice(e.detail.key);
                        }
                    }}
                />
                <p>
                    some permissions may need to be cleared in your <a
                        href="https://support.google.com/chrome/answer/114662"
                        target="_blank">browser</a
                    >
                </p>
            {:else}
                <p style:color="var(--color-gray-500)">[No Permissions]</p>
            {/if}
        </div>

        <!-- Component Libraries -->
        <div class="tab">
            <h5>Component Libraries</h5>
            <hr />
            <p style:color="var(--color-error-400)">Not implemented yet!</p>
        </div>

        <!-- Logs -->
        <div class="tab">
            <h5>Logs</h5>
            <hr />
            {#if Object.keys($logs).length > 0}
                <SearchableList items={{}} />
            {:else}
                <p style:color="var(--color-gray-500)">[No Logs]</p>
            {/if}
        </div>

        <!-- About -->
        <div class="tab">
            <h5>About This App</h5>
            <p>
                ploTTY is a serial monitor/plotting application maintained by <a
                    href="https://bojit.org/">James Bennion-Pedley</a
                >.
            </p>
            <hr />
            <p>
                Current Release: <a
                    href={"https://github.com/BOJIT/ploTTY/commit/" +
                        import.meta.env.VITE_GIT_HASH}
                    target="_blank"
                    rel="noreferrer"
                >
                    {import.meta.env.VITE_GIT_HASH}
                </a>
            </p>
            <p>
                If you have an issue or feature request let me know on <a
                    href="https://github.com/BOJIT/ploTTY/"
                    target="_blank"
                    rel="noreferrer">GitHub</a
                >!
            </p>
            <hr />
            <div class="center">
                <img src={Logo} alt="BOJIT Logo" />
            </div>
        </div>
    </Tabs>
</BaseDialog>

<BaseDialog title="Confirm Reset" bind:visible={areYouSure}>
    <p>
        This will reset <b>ALL</b> settings/patches/libraries to default state.
    </p>
    <div slot="actions">
        <TextIconButton
            label="Cancel"
            icon={CloseCircle}
            color="primary"
            on:click={() => {
                areYouSure = false;
            }}
        />
        <TextIconButton
            label="Confirm"
            icon={CheckmarkCircle}
            color="error"
            outlined
            on:click={() => {
                patch.reset();
                components.reset();
                logs.reset();
                hardware.reset();
                settings.reset();

                areYouSure = false;
                message.push({
                    type: "info",
                    title: "Reset Successful!",
                    message: "ploTTY has been reset to its default state",
                    timeout: 10,
                });
            }}
        />
    </div>
</BaseDialog>

<style>
    h5 {
        text-align: center;
        padding-top: 1rem;
    }

    h6 {
        margin-bottom: 0.3rem;
    }

    a {
        color: #237094;
    }

    p {
        /* max-width: 90%; */
        padding-top: 0.5rem;
        padding-bottom: 0.5rem;
        text-align: center;
    }

    :global(.mode-dark) a {
        color: #95b4c2;
    }

    .center {
        display: flex;
        align-items: center;
        justify-content: center;
    }

    .themes {
        display: flex;
        gap: 0.5rem;
        align-items: center;
    }

    .add-hardware {
        padding: 0.5rem;

        display: flex;
        align-items: center;
        gap: 0.5rem;
    }

    img {
        max-width: 5rem;
        padding-top: 1rem;
    }

    hr {
        margin-top: 0.4rem;
        margin-bottom: 0.4rem;
    }

    .switches {
        display: flex;
        gap: 1rem;
        align-items: center;
        justify-content: center;
        margin: 0.5rem;
    }
</style>
