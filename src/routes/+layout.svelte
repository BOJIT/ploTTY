<!--
 * @file +layout.svelte
 * @author James Bennion-Pedley
 * @brief Root Layout
 * @date 07/02/2023
 *
 * @copyright Copyright (c) 2023
 *
-->

<script lang="ts">
    /*-------------------------------- Imports -------------------------------*/

    // Uncomment if using quirky palette!
    // import "@fontsource/gloria-hallelujah"
    // import "@fontsource/nunito"
    // import "@fontsource/syne-mono"
    import "@fontsource/jetbrains-mono";

    import { App, Notification } from "@bojit/svelte-components/core";
    import { palette } from "@bojit/svelte-components/theme";
    import { ThemeSelector } from "@bojit/svelte-components/widgets";

    import { themeOverlay } from "$lib/stores/overlays";

    /*--------------------------------- Props --------------------------------*/

    /*-------------------------------- Methods -------------------------------*/

    /* Check browser is supported */
    async function loadCheck(resolve, reject) {
        // If in development deployment, bypass checks
        if (import.meta.env.VITE_BROWSER_CHECK === "false") resolve();

        // Check browser compatibility
        if ("serial" in navigator) {
            resolve();
        } else {
            reject("Web Serial API not supported in your browser!");
        }
    }

    /*------------------------------- Lifecycle ------------------------------*/
</script>

<App theme={palette.midnight} load={loadCheck}>
    <slot />
</App>

<ThemeSelector bind:active={$themeOverlay} />
<Notification />
