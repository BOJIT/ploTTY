<!--
 * @file EditorNode.svelte
 * @author James Bennion-Pedley
 * @brief Brief summary here
 * @date 29/05/2023
 *
 * @copyright Copyright (c) 2023
 *
-->

<script lang="ts">
    /*-------------------------------- Imports -------------------------------*/

    import { Node, Anchor } from "svelvet";

    import { ThumbsUp as DefaultIcon } from "@svicons/ionicons-outline";

    /*--------------------------------- Props --------------------------------*/

    /*-------------------------------- Methods -------------------------------*/

    function handleClick(e: CustomEvent) {
        const { detail } = e;
        detail.node.set.bgColor("red");
    }

    /*------------------------------- Lifecycle ------------------------------*/
</script>

<div />

<Node let:grabHandle let:selected on:nodeClicked={handleClick}>
    <Anchor />
    <div use:grabHandle class:selected class="editor-node">
        <div class="editor-node-ring">
            <div class="editor-node-icon">
                <svelte:component
                    this={DefaultIcon}
                    height="85px"
                    color="#c8ced0"
                />
            </div>
        </div>
    </div>
    <Anchor />
</Node>

<style>
    .editor-node {
        border-radius: 20px;
        border: 5px solid #444444;

        height: 100px;
        width: 100px;

        position: absolute;
        display: grid;
        place-items: center;

        user-select: none;
        justify-content: center;
        overscroll-behavior: auto;
        align-items: center;
        text-align: center;
        pointer-events: auto; /* this is needed for pointer events to work since we disable them in graphview */
    }

    .editor-node-ring {
        grid-row: 1;
        grid-column: 1;

        width: 90px;
        height: 100%;

        position: relative;
    }

    .editor-node-icon {
        position: absolute;
        top: 2px;
        left: 2px;

        background-color: #d9e1e3;

        width: calc(100% - 4px);
        height: calc(100% - 4px);
        border-radius: 13px;
        background-color: #d8e0e2f7;

        display: grid;
        place-items: center;
    }
</style>
