<script lang="ts">
    import App from "@bojit/svelte-components/core/App/App.svelte";
    import { palette } from "@bojit/svelte-components/theme";

    /* Check browser is supported */
    async function loadCheck(resolve, reject) {
        // Check browser compatibility
        if('serial' in navigator) {
            resolve();
        } else {
            reject("Web Serial API not supported in your browser!");
        }
    }
</script>

<App theme={palette.midnight} load={loadCheck}>
    <slot />
</App>
