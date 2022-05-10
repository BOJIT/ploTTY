<script lang="ts">
    import App from "@bojit/svelte-components/core/App/App.svelte";
    import Button from "@bojit/svelte-components/smelte/components/Button/Button.svelte";
    import NavBar from "@bojit/svelte-components/layout/NavBar/NavBar.svelte";
    import Tabs from "@bojit/svelte-components/widgets/Tabs/Tabs.svelte";
    import type { NavItem } from "@bojit/svelte-components/layout/NavBar/NavBar.svelte";
    import Dialog from "@bojit/svelte-components/smelte/components/Dialog/Dialog.svelte";
    import Footer from "@bojit/svelte-components/layout/Footer/Footer.svelte";

    import Theme, { palette } from "@bojit/svelte-components/theme";

    import logo from "$lib/assets/img/Logo.png";

    let mode = Theme.Mode;

    /* Check browser is supported */
    async function loadCheck(resolve, reject) {
        // Check browser compatibility
        if('serial' in navigator) {
            resolve();
        } else {
            reject("Web Serial API not supported in your browser!");
        }
    }

    function toggleTheme() {
        if($mode == 'light')
            $mode = 'dark';
        else
            $mode = 'light';
    }

    let items: NavItem[] = [
        {
            type: "button",
            color:  "success",
            icon: "play_arrow",
            // outlined: true,
        },
        {
            type: "button",
            color:  "alert",
            icon: "bar_chart",
            // outlined: true,
        },
        {
            type: "separator",
            visibility: "desktop",
        },
        {
            type: "button",
            color: "transparent",
            icon: "note_add",
            visibility: "desktop",
        },
        {
            type: "button",
            color: "transparent",
            icon: "file_open",
            visibility: "desktop",
        },
        {
            type: "button",
            color: "transparent",
            icon: "file_copy",
            visibility: "desktop",
            callback: () => {
                showDialog = true;
            }
        },
        {
            type: "separator",
        },
        {
            type: "button",
            color: "transparent",
            icon: "tune",
            visibility: "desktop",
            callback: toggleTheme
        },
        {
            type: "button",
            color: "transparent",
            icon: "menu",
            visibility: "mobile",
        },
    ];

    let showDialog = false;
    let tabIndex = 0;
</script>

<Dialog bind:value={showDialog}>
    <h5 slot="title">Settings</h5>
    <Tabs tabs={[
        "Test",
        "TFA",
    ]} bind:index={tabIndex}/>

    {#if tabIndex == 0}
        <p>Test Message</p>
    {/if}

    {#if tabIndex == 1}
        <p>Tab formatting</p>
    {/if}

    <div slot="actions">
        <Button text on:click={() => showDialog = false}>Disagree</Button>
        <Button text on:click={() => showDialog = false}>Agree</Button>
    </div>
</Dialog>

<App theme={palette.midnight} load={loadCheck}>
    <NavBar title="ploTTY" logo={logo} logoLink="https://github.com" items={items}/>

    <slot />
</App>
