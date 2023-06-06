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

import type { PlottyPatch } from "$lib/types/plotty";

import localForage from "localforage";

import NofloGraph from "$lib/middlewares/fbp-graph";
import file from "$lib/utils/file";

/*--------------------------------- Types ------------------------------------*/

type PatchLibrary = {
    "_currentPatch": string,
    [key: string]: PlottyPatch | string,
}

/*--------------------------------- State ------------------------------------*/

const DEFAULT: PlottyPatch = {
    key: "Example Patch",
    metadata: {
        version: import.meta.env.VITE_GIT_HASH,
    },
    graph: new NofloGraph.Graph().toJSON(),
}

const DEFAULT_LOCALSTORE: PatchLibrary = {
    "_currentPatch": "Example Patch",
    "Example Patch": DEFAULT,
    "Example Patch (1)": DEFAULT,
    "Example Patch (2)": DEFAULT,
};


let store: Writable<PlottyPatch> = writable(DEFAULT);
let patchlist: Writable<string[]> = writable([]);
const localStore: LocalForage = localForage.createInstance({
    name: "patches"
});

/*-------------------------------- Helpers -----------------------------------*/

async function updateKeylist() {
    const keys = await localStore.keys();
    let idx = keys.indexOf("_currentPatch");
    if (idx != -1)
        keys.splice(idx, 1);
    patchlist.set(keys);
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

    // Subscribe for store updates
    store.subscribe(async (val: PlottyPatch) => {
        const name = await localStore.getItem("_currentPatch") as string;
        await localStore.setItem(name, val);

        // TODO timeout every 5 seconds to prevent too many writes to disk!
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

async function create(key: string, patch: PlottyPatch = DEFAULT): Promise<boolean> {
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

export { patchlist };

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
