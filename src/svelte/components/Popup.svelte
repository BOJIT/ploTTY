<script lang="ts">
    import { popup } from "src/svelte/store/overlays"

</script>

<div class="container">
    {#each $popup as entry}
        <div class="box"
                class:popup-info="{entry.type === "info"}"
                class:popup-warning="{entry.type === "warning"}"
                class:popup-error="{entry.type === "error"}">
            <h1>{entry.title}</h1>
            <p>{entry.message}</p>
        </div>
    {/each}
</div>

<style lang="scss">
    @charset "utf-8";
    @import "src/constants.scss";

    .container {
        position: fixed;
        display: grid;
        place-items: center;
        height: 20%;    /* TODO make dependent on message height + a bit */
        width: 30em;
        bottom: 0;
        left: 0;
        pointer-events: none;
        background-color: blue;
    }

    @media screen and (max-width: ($desktop - 1)) {
        .container {
            width: 100%;
        }
    }

    .popup-info {
        background-color: hsl(204, 86%, 53%);
    }

    .popup-warning {
        background-color: hsl(48, 100%, 67%);
    }

    .popup-error {
        background-color: hsl(348, 100%, 61%);
    }
</style>
