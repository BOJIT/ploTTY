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

    import {
        BarChart,
        Document,
        Duplicate,
        FolderOpen,
        Menu,
        Play,
        Settings,
     } from "@svicons/ionicons-outline";

    import logo from "$lib/assets/img/Logo.png";

    /*--------------------------------- Props --------------------------------*/

    let items: NavItem[] = [
        {
            type: "button",
            color: "var(--color-success-700)",
            icon: Play,
            // outlined: true,
        },
        {
            type: "button",
            color: "var(--color-error-700)",
            icon: BarChart,
            // outlined: true,
        },
        {
            type: "separator",
            visibility: "desktop",
        },
        {
            type: "button",
            color: "transparent",
            icon: Document,
            visibility: "desktop",
        },
        {
            type: "button",
            color: "transparent",
            icon: FolderOpen,
            visibility: "desktop",
        },
        {
            type: "button",
            color: "transparent",
            icon: Duplicate,
            visibility: "desktop",
        },
        {
            type: "separator",
        },
        {
            type: "button",
            color: "transparent",
            icon: Settings,
            visibility: "desktop",
        },
        {
            type: "button",
            color: "transparent",
            icon: Menu,
            visibility: "mobile",
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
/>

<!-- Panel Tabs -->
<!-- <Tabs/> -->

<!-- Editor overlay -->
<!-- <Editor /> -->
