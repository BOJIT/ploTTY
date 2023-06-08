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
    import { Tabs } from "@bojit/svelte-components/widgets";
    import theme from "@bojit/svelte-components/theme";
    const mode = theme.Mode;

    import {
        CheckmarkCircle,
        CloseCircle,
        CloudDownload,
        Contrast,
        Moon,
        Settings,
        Sunny,
        Warning,
    } from "@svicons/ionicons-outline";

    import components from "$lib/stores/components";
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

    /*------------------------------- Lifecycle ------------------------------*/

    $: if (visible) {
        index = 0;
    }
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
            <hr />
            <h6 class="center">Program Configuration</h6>
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

        <!-- Component Library -->
        <div class="tab">
            <h5>Component Library</h5>
            <SearchableList items={{}} />
        </div>

        <!-- Logs -->
        <div class="tab">
            <h5>Logs</h5>
            <SearchableList items={{}} />
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
                settings.reset();
                patch.reset();
                components.reset();

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
        /* color: var(--color-gray-200); */
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

    img {
        max-width: 5rem;
        padding-top: 1rem;
    }

    hr {
        margin-top: 0.4rem;
        margin-bottom: 0.4rem;
    }
</style>
