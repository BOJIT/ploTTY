<!--
 * @file SvelvetAPI.svelte
 * @author James Bennion-Pedley
 * @brief Non-DOM component for accessing internal Svelvet context
 * @date 20/06/2023
 *
 * This entire file is just a workaround for missing library features!
 *
 * @copyright Copyright (c) 2023
 *
-->

<script lang="ts">
    /*-------------------------------- Imports -------------------------------*/

    import { getContext } from "svelte";

    import type { Graph as NofloGraphType } from "$lib/middlewares/fbp-graph/Graph";

    import NofloGraph from "$lib/middlewares/fbp-graph";

    import { Anchor, createEdge, type EdgeStore } from "svelvet";

    /*--------------------------------- Props --------------------------------*/

    export let graph: NofloGraphType;
    export let nodeSelected: string[] = [];

    const svelvetGraph: any = getContext("graph");
    const { bounds, center, dimensions, edges, groups, nodes } = svelvetGraph;
    const selectedNodes = $groups.selected.nodes;
    const nodeBounds = bounds.nodeBounds;

    let renamePending: any | null = null;

    /*-------------------------------- Methods -------------------------------*/

    function calculateFitView(
        dimensions: any,
        bounds: { top: number; left: number; right: number; bottom: number }
    ) {
        const { width, height } = dimensions;
        const { top, left, right, bottom } = bounds;
        const boundsWidth = right - left;
        const boundsHeight = bottom - top;

        if (!boundsWidth || !boundsHeight)
            return { x: null, y: null, scale: null };

        const centerX = left + boundsWidth / 2;
        const centerY = top + boundsHeight / 2;

        const scale =
            Math.min(width / boundsWidth, height / boundsHeight) * 0.8;

        const viewportCenterX = width / 2;
        const viewportCenterY = height / 2;

        const translateX = viewportCenterX - centerX;
        const translateY = viewportCenterY - centerY;

        return {
            x: translateX * scale,
            y: translateY * scale,
            scale: scale,
        };
    }

    function getAnchorFromString(
        node: string,
        port: string
    ): [Node, Anchor] | null {
        let nodeObject = $nodes.get(`N-${node}`);
        if (nodeObject === undefined) return null;

        const anchorObject = nodeObject.anchors
            .getAll()
            .find((a: Anchor) => a.inputKey === port);

        return [nodeObject, anchorObject];
    }

    function createSvelvetSet(
        srcNode: string,
        srcPort: string,
        tgtNode: string,
        tgtPort: string
    ) {
        let src = getAnchorFromString(srcNode, srcPort);
        let tgt = getAnchorFromString(tgtNode, tgtPort);

        if (src === null || tgt === null) return null;

        return new Set([src[1], tgt[1], src[0], tgt[0]]);
    }

    function syncGraphs(e: any, g: NofloGraphType) {
        // UI Edges
        const uimap = new Map();
        e.forEach((value: any, key: any) => {
            if (key === "cursor") return "";

            // I'm sorry...
            const anchormap = [...key];
            const id = `${anchormap[2].id.substring(2)}/${
                anchormap[0].inputKey
            }-${anchormap[3].id.substring(2)}/${anchormap[1].inputKey}`;

            uimap.set(id, key);
        });

        // Graph Edges
        const graphmap = new Map();
        g.edges.forEach((v: any) => {
            const key = `${v.from.node}/${v.from.port}-${v.to.node}/${v.to.port}`;
            graphmap.set(
                key,
                createSvelvetSet(v.from.node, v.from.port, v.to.node, v.to.port)
            );
        });

        // Work out intersections for update
        const toAdd = [...graphmap.keys()].filter((x) => !uimap.has(x));
        const toRemove = [...uimap.keys()].filter((x) => !graphmap.has(x));

        // console.log("To Add:", toAdd);
        // console.log("To Remove:", toRemove);

        toRemove.forEach((r) => {
            const handle = uimap.get(r);
            if (handle !== undefined) edges.delete(handle);
        });

        toAdd.forEach((a: string) => {
            const entry = graphmap.get(a);

            if (entry === null || entry === undefined) return;

            const aArray = [...entry];
            const newEdge = createEdge(
                { source: aArray[0], target: aArray[1] },
                aArray[0].edge,
                {}
            );
            edges.add(newEdge, new Set(entry));
        });
    }

    /*----------------------------- Public Methods ---------------------------*/

    export function fitGraph() {
        const { x, y, scale } = calculateFitView($dimensions, $nodeBounds);
        svelvetGraph.transforms.translation.set({ x: x || 0, y: y || 0 });
        svelvetGraph.transforms.scale.set(scale || 1);
    }

    export function resetGraph() {
        // Copy over listeners
        const listeners = graph.listeners("endTransaction");
        // Reset graph to initial state, then restore listeners
        graph = new NofloGraph.Graph();
        graph.on("endTransaction", listeners[0]);

        nodeSelected = [];
    }

    export function addNode(type: string) {
        /* Generate node ID - this is a sanitised string with increasing index */
        const root = type.split("/").pop()?.replace(/\s/g, "-"); // Start as node identifier
        let id: string = root;
        let suffix = 1;
        while (graph.nodes.some((node) => node.id === id)) {
            id = `${root}${suffix}`;
            suffix += 1;
        }

        /* Place in stack if place is taken */
        let increment = 0;
        while (
            graph.nodes.some((node) => {
                // Check if any node is within 20px of target
                if (
                    Math.abs(node.metadata.position.x - $center.x + increment) <
                        20 &&
                    Math.abs(node.metadata.position.y - $center.y + increment) <
                        20
                )
                    return true;

                return false;
            })
        ) {
            increment += 20;
        }

        /* Add UI-related metadata */
        const metadata = {
            position: {
                x: $center.x + increment,
                y: $center.y + increment,
            },
        };

        graph.addNode(id, type, metadata);
    }

    export function removeNode(id: string) {
        graph.removeNode(id);
        nodeSelected = [];
    }

    export function renameNode(id: string, rename: string) {
        if (nodeSelected.length !== 1) return;

        let node = graph.nodes.find((n) => id === n.id);
        if (node === undefined) return;

        renamePending = node;
        // Assigning this will deselect the node
        graph.renameNode(node.id, rename);

        node.metadata.label = rename; // Explicit override
        graph = graph; // Trigger prop update
        nodeSelected[0] = node.id;
    }

    export function addEdge(svelvetData: any) {
        const sn = svelvetData.sourceNode.id.substring(2);
        const sp = svelvetData.sourceAnchor.inputKey;
        const tn = svelvetData.targetNode.id.substring(2);
        const tp = svelvetData.targetAnchor.inputKey;

        graph.addEdge(sn, sp, tn, tp);
    }

    export function removeEdge(svelvetData: any) {
        const sn = svelvetData.sourceNode.id.substring(2);
        const sp = svelvetData.sourceAnchor.inputKey;
        const tn = svelvetData.targetNode.id.substring(2);
        const tp = svelvetData.targetAnchor.inputKey;
        graph.removeEdge(sn, sp, tn, tp);
    }

    // HACK: This can be removed once library support is added
    export function triggerEdgeSync() {
        syncGraphs($edges, graph);
    }

    /*------------------------------- Lifecycle ------------------------------*/

    selectedNodes.subscribe((s: Set<any>) => {
        if (renamePending) {
            // Deal with annoyance of deselection on id change
            $selectedNodes.add(renamePending);
            renamePending = null;
            $selectedNodes = $selectedNodes;
            return;
        }

        const n: string[] = [];
        $selectedNodes.forEach((sn: any) => {
            if ([...s][0].id.startsWith("N-")) n.push(sn.id.substring(2));
            else n.push(sn.id);
        });
        nodeSelected = n;
    });

    // This keeps the two graphs in sync (HACK until lib support exists)
    $: {
        syncGraphs($edges, graph);
    }
</script>
