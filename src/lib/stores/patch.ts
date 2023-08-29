/**
 * @file patch.ts
 * @author James Bennion-Pedley
 * @brief Handles patch synchronisation with IndexedDB
 * @date 09/02/2023
 *
 * @copyright Copyright (c) 2023
 *
 */

/*-------------------------------- Imports -----------------------------------*/

import { get, writable, type Writable } from "svelte/store";

import writableDerived from "svelte-writable-derived";
import localForage from "localforage";

import type { PlottyPatch } from "$lib/types/plotty";
import type { Graph as GraphType } from "$lib/middlewares/fbp-graph/Graph";

import NofloGraph from "$lib/middlewares/fbp-graph";
import file from "$lib/utils/file";

// Example patches
import example1 from "$lib/standard-library/patches/example-patch.plotty";
import example2 from "$lib/standard-library/patches/serial-filter-logs.plotty";
import example3 from "$lib/standard-library/patches/dual-serial.plotty";

/*--------------------------------- Types ------------------------------------*/

type PatchLibrary = {
    "_currentPatch": string,
    [key: string]: PlottyPatch | string,
}

/*--------------------------------- State ------------------------------------*/

const EMPTY_PATCH: PlottyPatch = {
    key: "Example Patch",
    metadata: {
        version: import.meta.env.VITE_GIT_HASH,
    },
    graph: new NofloGraph.Graph().toJSON(),
}

const DEFAULT: PlottyPatch = {
    key: "Example Patch",
    metadata: {
        version: import.meta.env.VITE_GIT_HASH,
    },
    graph: example1.graph,
}

const DEFAULT_LOCALSTORE: PatchLibrary = {
    "_currentPatch": "Example Patch",
    "Example Patch": example1,
    "Serial Filter Logs": example2,
    "Dual Serial": example3,
};


let store: Writable<PlottyPatch> = writable(DEFAULT);
let patchlist: Writable<string[]> = writable([]);
const localStore: LocalForage = localForage.createInstance({
    name: "patches"
});
let localStoreTransaction: ReturnType<typeof setTimeout> | null = null;

const graph: Writable<GraphType> = writableDerived(store, patchToGraph, graphToPatch);

/*-------------------------------- Helpers -----------------------------------*/

async function updateKeylist() {
    const keys = await localStore.keys();
    let idx = keys.indexOf("_currentPatch");
    if (idx != -1)
        keys.splice(idx, 1);
    patchlist.set(keys);
}

function patchToGraph(patch: PlottyPatch): GraphType {
    // TODO deal with deserialisation errors!
    const g = NofloGraph.loadJSONSync(patch.graph);
    return g !== null ? g : new NofloGraph.Graph();

    // TODO timeout every 5 seconds to prevent too many writes to disk!
}

function graphToPatch(graph: GraphType, previous: PlottyPatch): PlottyPatch {
    previous.graph = graph.toJSON();
    return previous;
}

/*------------------------------- Functions ----------------------------------*/

async function init(): Promise<Writable<PlottyPatch>> {
    // Does local store exist?
    const name = await localStore.getItem("_currentPatch") as string;

    if (name !== null) {
        // Get current patch and set store
        const patch = await localStore.getItem(name) as PlottyPatch;
        if (patch !== null) {
            patch.key = name;   // Convenience
            store.set(patch);
        } else {
            // Create default patch and open that
            await localStore.setItem("Example Patch 1", DEFAULT);
            await localStore.setItem("_currentPatch", "Example Patch 1");
            store.set(DEFAULT);
        }
    } else {
        // Create default storage
        for (const [key, val] of Object.entries(DEFAULT_LOCALSTORE)) {
            await localStore.setItem(key, val);
        }
        store.set(DEFAULT);
    }

    // Update key list
    await updateKeylist();

    // Subscribe for store updates (run 0.5 seconds behind to cache movements)
    store.subscribe(async (val: PlottyPatch) => {
        if (localStoreTransaction !== null) {
            clearTimeout(localStoreTransaction);
        }

        localStoreTransaction = setTimeout(async () => {
            const name = await localStore.getItem("_currentPatch") as string;
            await localStore.setItem(name, val);
            localStoreTransaction = null;
        }, 500);
    });

    return store;
}

async function open(key: string): Promise<boolean> {
    // Is the file in the database?
    const patch = await localStore.getItem(key) as PlottyPatch;

    if (patch === null)
        return false;   // File not found!

    // Set current patch key, THEN update store
    await localStore.setItem("_currentPatch", key);
    patch.key = key;    // Ensure key is consistent with library key
    store.set(patch);

    return true;
}

async function create(key: string, patch: PlottyPatch = EMPTY_PATCH): Promise<boolean> {
    if (!validName(key))
        return false;

    // Add entry and update keylist
    patch.key = key;    // Ensure consistency
    await localStore.setItem(key, patch);
    await updateKeylist();

    return true;
}

function validName(name: string): boolean {
    if (name === "")
        return false;

    const list = get(patchlist);
    if (list.includes(name))
        return false;

    return true;
}

async function remove(key: string): Promise<boolean> {
    const name = await localStore.getItem("_currentPatch") as string;

    if (name === key)
        return false;   // Cannot delete the currently open patch

    // Remove item and update keylist
    await localStore.removeItem(key);
    await updateKeylist();

    return true;
}

async function reset(): Promise<void> {
    await localStore.clear();

    // Create default storage
    for (const [key, val] of Object.entries(DEFAULT_LOCALSTORE)) {
        await localStore.setItem(key, val);
    }
    store.set(DEFAULT);

    // Update keylist
    await updateKeylist();
}

async function upload(files: File[]): Promise<boolean | null> {
    if (files.length === 0)
        return true;    // Nothing to be done!

    let status: boolean | null = true;
    for (let i = 0; i < files.length; i++) {
        let patch = JSON.parse(await file.read(files[i]) as string) as PlottyPatch;

        // Check if file is corrupt
        if (patch.key === undefined) {
            status = null; // Something failed
        } else {
            // Will this override an existing patch?
            if (await localStore.getItem(patch.key) !== null) {
                patch.key = file.incrementName(patch.key, get(patchlist));
                status = false;
            }

            // Add files individually and update patchlist
            await create(patch.key, patch);
            await updateKeylist();
        }
    }

    return status;
}

async function download(key: string): Promise<Blob | null> {
    const patch = await localStore.getItem(key) as PlottyPatch;

    if (patch === null)
        return null;

    // Add export date
    patch.metadata.exportDate = new Date().toISOString();

    const f = new Blob([JSON.stringify(patch)], { type: 'application/json' });
    return f;
}

/*-------------------------------- Exports -----------------------------------*/

export { patchlist, graph };

export default {
    subscribe: store.subscribe,
    set: store.set,
    update: store.update,
    patchlist,
    init,
    open,
    create,
    validName,
    remove,
    reset,
    upload,
    download,
}
