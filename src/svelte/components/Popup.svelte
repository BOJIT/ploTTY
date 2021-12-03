<script lang="ts">
    /* Interface and default message */
    export let title:string = "Example Popup";
    export let message:string = "Lorem amet do minim voluptate esse enim labore sunt.";
    export let type: "info" | "warning" | "error" = "info";
    export let timeout: Number | undefined = undefined;

    if(timeout !== undefined) {
        console.log("No Timeout...");
    }

</script>

<div class="container">
    <div class="box"
            class:popup-info="{type === "info"}"
            class:popup-warning="{type === "warning"}"
            class:popup-error="{type === "error"}">
        <h1>{title}</h1>
        <p>{message}</p>
    </div>
</div>


<style>
    .container {
        position: fixed;
        display: grid;
        place-items: center;
        height: 100%;
        width: 100%;
        pointer-events: none;
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
