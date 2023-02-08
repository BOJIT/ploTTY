<script lang="ts">
    /* Svelte */
    import { onDestroy } from 'svelte';
    import { fly } from 'svelte/transition';

    /* TheGraph Editor */
    // import TheGraph from 'noflo-svelte/TheGraph.svelte';
    // import { Graph, graph as graph_api } from 'fbp-graph';
    // import { createNetwork } from 'noflo';

    /* Autolayout worker */
    // import 'klayjs/klay.js';
    // let workerURL = 'worker/klay.js';

    /* Stores */
    // import Theme from "@bojit/svelte-components/theme";

    /* Panel Management */


    /* Internal State */
    let graph;
    let API: any;
    let state: any = {
        selected: "",
        canUndo: false,
        canRedo: false
    };

    /*-------------------------- NoFlo Network Code --------------------------*/

    // let network = null;
    // async function runNetwork() {
    //     if(network === null) {
    //         createNetwork(graph, {
    //             componentLoader: library.loader
    //         }).then((n) => {
    //             n.start();
    //             network = n;
    //         });
    //     }
    // }

    // function stopNetwork() {
    //     if(network !== null) {
    //         network.stop();
    //         network = null;
    //     }
    // }

    // editor.subscribe((s) => {
    //     if(s.running) {
    //         runNetwork();
    //     } else {
    //         stopNetwork();
    //     }
    // });

    /*-------------------------- Graph Editor Hooks --------------------------*/

    /* Handle changes in the graph editor */
    function graphChanged() {

    }

    /* Load new graph when selected patch changes */
    // let us = settings.subscribe((s) => {
    //     let idx = $patches.findIndex((p) => p.name === s.currentPatch);
    //     graph_api.loadJSON($patches[idx].graph).then((g) => {
    //         graph = g;
    //         graphChanged();
    //         API.clearHistory();
    //         // TODO make recentreGraph smooth
    //         window.setTimeout(() => API.recentreGraph(), 10);
    //     });
    // });
    // onDestroy(us);

    /*------------------------------ Editor UI -------------------------------*/

    /* Control Overlay Functions */
    let extended_visible = false;

    /* Function to detect a click outside the burger menu */
    // let blacklist: any = {};
    // function clickOutside(node: Node) {
    //     const handleClick = (event: Event) => {
    //         if (!node.contains(event.target as Node)) {
    //             for (const [, el] of Object.entries(blacklist) as any) {
    //                 if (!el.contains(event.target as Node)) {
    //                     extended_visible = false;
    //                 }
    //             }
    //         }
    //     };
    //     document.addEventListener("click", handleClick, true);
    //     return {
    //         destroy() {
    //             document.removeEventListener("click", handleClick, true);
    //         }
    //     };
    // }
</script>

<div class="editor" >
    <!-- <TheGraph theme={$Theme} bind:graph={graph} bind:API={API} bind:state={state}
     on:graphChange={graphChanged} library={[]} /> -->
</div>

<!-- <div class:hidden={!$editor.visible} >
    {#if extended_visible }
        <div transition:fly="{{ x:100 }}" use:clickOutside class="controls extended">
            <button on:click={() => {
                    $modal = {
                        component: Modals.Confirm,
                        props: {
                            title: "Clear Graph",
                            confirmHook: (() => {
                                API.clearGraph();
                                $modal = null;
                            })
                        }
                    }
                }} class="button is-large is-danger">
                <span class="icon">
                    <Icon data={faTimes} scale={1.75} />
                </span>
            </button>
            <button on:click={() => {
                    API.autolayoutGraph();
                }} class="button is-large is-clear">
                <span class="icon">
                    <Icon data={faMagic} scale={1.75} />
                </span>
            </button>
            <button on:click={() => {
                    API.undo();
                }} class="button is-large is-clear" disabled={!state.canUndo}>
                <span class="icon">
                    <Icon data={faUndo} scale={1.75} />
                </span>
            </button>
            <button on:click={() => {
                    API.redo();
                }} class="button is-large is-clear" disabled={!state.canRedo}>
                <span class="icon">
                    <Icon data={faRedo} scale={1.75} />
                </span>
            </button>
        </div>
    {/if}

    <div class="controls">
        {#if state.selected !== "" }
            <button transition:fly="{{ y:100 }}" on:click={() => {
                    if(state.selected !== "") {
                        $modal = {
                            component: Modals.ComponentSettings,
                            props: {
                                graph: graph,
                                selected: state.selected
                            }
                        }
                    }
                }} class="button is-large is-clear">
                <span class="icon">
                    <Icon data={faCog} scale={1.75} />
                </span>
            </button>
            <button transition:fly="{{ y:100 }}" on:click={() => {
                    API.removeComponent(state.selected);
                }} class="button is-large is-clear">
                <span class="icon">
                    <Icon data={faTrash} scale={1.75} />
                </span>
            </button>
        {/if}

        <button on:click={() => {
                $modal = {
                    component: Modals.AddComponent,
                    props: {
                        addHook: ((sel) => {
                            $modal = null;
                            API.addComponent(sel.split('/').pop());
                        })
                    }
                }
            }} class="button is-large is-clear">
            <span class="icon">
                <Icon data={faPlus} scale={1.75} />
            </span>
        </button>
        <button on:click={() => {
                API.recentreGraph();
            }} class="button is-large is-clear">
            <span class="icon">
                <Icon data={faExpand} scale={1.75} />
            </span>
        </button>
        <button bind:this={blacklist.trigger} on:click={() => {
                extended_visible = !extended_visible;
            }} class="button is-large is-clear">
            <span class="icon">
                <Icon data={faEllipsisH} scale={1.75} />
            </span>
        </button>
    </div>
</div> -->

<style>
    /* State Styling */
    /* .hidden {
        display: none;
    } */

    /* Editor/NoFlo Styling */
    .editor {
        height: 100%;
        width: 100%;
        position: absolute;
        z-index: 10;

        background-color: red;
    }

    /* Overlay Styling */
    /* .controls {
        position: absolute;
        bottom: 2rem;
        right: 2rem;
        z-index: 20;
        display: flex;
        flex-direction: column;
        gap: 1rem
    }

    .controls .button {
        border-radius: 50%;
    }

    .controls.extended {
        right: 7rem;
        flex-direction: row;
    } */

    /* Button Styling */
    /* .button:focus {
        outline: none;
        box-shadow: none;
    }

    .button.is-clear {
        border: none;
    }

    .button.is-clear:hover {

    }

    .icon {

    } */
</style>
