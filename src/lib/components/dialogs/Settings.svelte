<!--
 * @file Settings.svelte
 * @author James Bennion-Pedley
 * @brief Settings Dialogue
 * @date 08/02/2023
 *
 * @copyright Copyright (c) 2023
 *
-->

<script lang='ts'>
    /*-------------------------------- Imports -------------------------------*/

    import { SearchableList } from "@bojit/svelte-components/form";
    import { BaseDialog } from "@bojit/svelte-components/layout";
    import { Tabs } from "@bojit/svelte-components/widgets";

    import {
        Settings,
    } from "@svicons/ionicons-outline";

    import Logo from "$lib/assets/img/BOJIT_Square.png";

    /*--------------------------------- Props --------------------------------*/

    export let visible: boolean = true;

    let tabs = [
        {
            label: "Global",
        },
        {
            label: "Components",
        },
        {
            label: "Logs",
        },
        {
            label: "About",
        },
    ];

    let index = 0;

    /*-------------------------------- Methods -------------------------------*/

    function mod(n:number , m:number) {
        return ((n % m) + m) % m;
    }

    function handleKeydown(event: KeyboardEvent) {
        if(event.key === 'Shift')
            return;

        if(event.shiftKey && (event.key === 'Tab')) {
            event.preventDefault();
            index = mod(index - 1, tabs.length);
        } else if(event.key === 'Tab') {
            event.preventDefault();
            index = mod(index + 1, tabs.length);
        }
    }

    /*------------------------------- Lifecycle ------------------------------*/

    $: if(visible) {
        index = 0;
    }
</script>


<svelte:window on:keydown={handleKeydown}/>

<BaseDialog title="Settings" icon={Settings} bind:visible>
    <Tabs tabs={tabs} bind:index>
        <!-- Global -->
        <div class="tab">
            <h2>Global</h2>
        </div>

        <!-- Component Library -->
        <div class="tab">
            <SearchableList items={{}}/>
        </div>

        <!-- Logs -->
        <div class="tab">
            <SearchableList items={{}}/>
        </div>

        <!-- About -->
        <div class="tab">
            <h5>About This App</h5>
            <p>
                ploTTY is a serial monitor/plotting application maintained
                by <a href="https://bojit.org/">James Bennion-Pedley</a>.
            </p>
            <hr>
            <p>Current Release: <a href={"https://github.com/BOJIT/ploTTY/commit/" + import.meta.env.VITE_GIT_HASH} target="_blank" rel="noreferrer">
                {import.meta.env.VITE_GIT_VERSION}
            </a></p>
            <p>
                If you have an issue or feature request let me know on <a href="https://github.com/BOJIT/ploTTY/" target="_blank" rel="noreferrer">GitHub</a>!
            </p>
            <hr>
            <div class="center">
                <img src={Logo} alt="BOJIT Logo"/>
            </div>
        </div>
    </Tabs>
</BaseDialog>


<style>
    h5 {
        text-align: center;
        padding-top: 1rem;
    }

    a {
        color: #237094;
    }

    p {
        /* max-width: 90%; */
        padding-top: 0.5rem;
        padding-bottom: 0.5rem;
        text-align: center;
        /* color: var(--color-gray-200); */
    }

    :global(.mode-dark) a {
        color: #95b4c2;
    }

    .center {
        display: flex;
        align-items: center;
        justify-content: center;
    }

    img {
        max-width: 5rem;
        padding-top: 1rem;
    }
</style>
