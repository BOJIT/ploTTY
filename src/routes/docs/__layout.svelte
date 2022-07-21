<script lang="ts">
    // State
    import Theme from "@bojit/svelte-components/theme";
    const mode = Theme.Mode;

    // Components
    import Content from "@bojit/svelte-components/layout/Content/Content.svelte";
    import NavBar from "@bojit/svelte-components/layout/NavBar/NavBar.svelte";
    import type { NavItem } from "@bojit/svelte-components/layout/NavBar/NavBar.svelte";

    // Assets
    import logo from "$lib/assets/img/Logo.png";

    function toggleTheme() {
        if($mode == 'light')
            $mode = 'dark';
        else
            $mode = 'light';
    }

    let items: NavItem[] = [
        {
            type: "button",
            color: "transparent",
            icon: "light_mode",
            callback: toggleTheme
        },
    ];
</script>

<NavBar title="ploTTY" logo={logo} logoLink="https://github.com/BOJIT/ploTTY" items={items} />

<Content>
    <slot />
</Content>
