<!--
 * @file SvelvetLetHook.svelte
 * @author James Bennion-Pedley
 * @brief This is a bit of a hack to let us bind to a variable in a let slot.
 * @date 08/06/2023
 *
 * @copyright Copyright (c) 2023
 *
-->

<script lang="ts">
    /*--------------------------------- Props --------------------------------*/

    export let input: any;
    export let output: any;

    /*------------------------------- Lifecycle ------------------------------*/

    $: {
        input;
        output = input;
    }
</script>
