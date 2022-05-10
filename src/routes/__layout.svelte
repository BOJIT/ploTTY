<script lang="ts">
    import "@bojit/svelte-components/global.css";

    import theme, { palette } from "@bojit/svelte-components/theme";
    import SplashScreen from "@bojit/svelte-components/core/SplashScreen/SplashScreen.svelte";

    /* Example pre-page-loading routine */
    async function loadCheck(resolve, reject) {
        // Set theme
        theme.init(palette.evergreen);

        // Check browser compatibility
        if('serial' in navigator) {
            resolve();
        } else {
            reject("Web Serial API not supported in your browser!");
        }
    }
</script>

<SplashScreen load={loadCheck}/>

<!-- TODO remove top level smelte class - scope to components -->
<div class="smelte">
    <slot />
</div>
