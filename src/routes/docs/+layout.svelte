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
    import Theme from "@bojit/svelte-components/theme";

    import IconEyedrop from "@svicons/ionicons-outline/eyedrop.svelte";
    import IconHome from "@svicons/ionicons-outline/home.svelte";

    import logo from "$lib/assets/img/Logo.png";

    import themeOverlay from "$lib/stores/themeOverlay";

    /*--------------------------------- Props --------------------------------*/

    let items: NavItem[] = [
        {
            type: "button",
            color: "transparent",
            icon: IconEyedrop,
            callback: () => {
                $themeOverlay = true;
            }
        },
        {
            type: "button",
            color: "transparent",
            icon: IconHome,
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
