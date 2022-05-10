<script lang="ts">
    import RadioButtonGroup from "@bojit/svelte-components/smelte/components/RadioButton/RadioButtonGroup.svelte";

    import theme from "@bojit/svelte-components/theme";
    const mode = theme.Mode;
</script>

<style>
    h3 {
        padding: 1rem;
    }
</style>

<h3>Theme</h3>

<RadioButtonGroup name='Theme' bind:selected={$mode}
    items={[
        { value: 'light', label: 'Light Mode' },
        { value: 'dark', label: 'Dark Mode' },
        { value: 'auto', label: 'Auto Mode'}
    ]} />
