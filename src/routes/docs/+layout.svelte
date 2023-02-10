<!--
 * @file +layout.svelte
 * @author James Bennion-Pedley
 * @brief Brief summary here
 * @date 07/02/2023
 *
 * @copyright Copyright (c) 2023
 *
-->

<script lang='ts'>
    /*-------------------------------- Imports -------------------------------*/

    import { goto } from "$app/navigation";

    import { Content, NavBar, type NavItem } from "@bojit/svelte-components/layout";

    import {
        Eyedrop,
        Home,
    } from "@svicons/ionicons-outline";

    import logo from "$lib/assets/img/Logo.png";

    import { themeOverlay } from "$lib/stores/overlays";

    /*--------------------------------- Props --------------------------------*/

    let items: NavItem[] = [
        {
            type: "button",
            color: "transparent",
            icon: Eyedrop,
            label: "Edit Theme",
            callback: () => {
                $themeOverlay = true;
            }
        },
        {
            type: "button",
            color: "transparent",
            icon: Home,
            label: "Home",
            callback: () => {
                goto('/');
            }
        },
    ];

    /*-------------------------------- Methods -------------------------------*/

    /*------------------------------- Lifecycle ------------------------------*/
</script>


<!-- Main Navigation -->
<NavBar
    title="ploTTY"
    logo={logo}
    logoLink="https://github.com/BOJIT/ploTTY"
    themeOverride="dark"
    items={items}
/>

<Content>
    <slot />
</Content>
