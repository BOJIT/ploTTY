<!--
 * @file BaseDialog.svelte
 * @author James Bennion-Pedley
 * @brief Template for responsive dialogues
 * @date 08/02/2023
 *
 * @copyright Copyright (c) 2023
 *
-->

<script lang='ts'>
    /*-------------------------------- Imports -------------------------------*/

    import type { SvelteComponent } from "svelte";
    import { createEventDispatcher } from "svelte";

    import { Dialog } from "@bojit/svelte-components/smelte";

    import {
        Settings,
    } from "@svicons/ionicons-outline";

    /*--------------------------------- Props --------------------------------*/

    export let visible: boolean = true;
    export let title: string = "placeholder";
    export let icon: SvelteComponent = Settings;

    let dispatch = createEventDispatcher();

    /*-------------------------------- Methods -------------------------------*/

    function handleKeydown(event: KeyboardEvent) {
        if(!visible)
            return; // Only handle keybindings when visible

        if(event.key === 'Escape')
             visible = false;

        if(event.key === 'Enter')
            dispatch('enter');
    }

    /*------------------------------- Lifecycle ------------------------------*/

</script>


<svelte:window on:keydown={handleKeydown}/>

<Dialog bind:value={visible} fullWidth>
    <div slot="title" class="title">
        <svelte:component this={icon} height="1.5rem"/>
        {title}
    </div>

    <slot />

    <div slot="actions">
        <slot name="actions"/>
    </div>
</Dialog>


<style>
    .title {
        width: 40rem;
        display: flex;
        align-items: center;
        gap: 0.5rem;
    }
    @media (max-width: 768px) {
        .title {
            width: 80vw;
        }
    }
</style>
