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

import localForage from "localforage";

import { Graph } from "fbp-graph";
import type { GraphJson } from "fbp-graph/lib/Types";

/*--------------------------------- Types ------------------------------------*/

type Metadata = {
    version: string,
    versionHash: string,
    exportDate: string,
}

type Patch = {
    key: string    // Duplicate of library key (useful for comprehensions)
    metadata: Metadata
    graph: GraphJson
};

type PatchLibrary = {
    "_currentPatch": string,
    [key:string]: Patch | string,
}

/*--------------------------------- State ------------------------------------*/

const DEFAULT: Patch = {
    key: "Example Patch",
    metadata: {
        version: import.meta.env.VITE_GIT_VERSION,
        versionHash: import.meta.env.VITE_GIT_HASH,
    },
    graph: new Graph().toJSON(),
}

const DEFAULT_LOCALSTORE: PatchLibrary = {
    "_currentPatch": "Example Patch",
    "Example Patch": DEFAULT,
    "Example Patch (1)": DEFAULT,
    "Example Patch (2)": DEFAULT,
};


let store: Writable<Patch> = writable(DEFAULT);
let patchlist: Writable<string[]> = writable([]);
const localStore: LocalForage = localForage.createInstance({
    name: "patches"
});

/*-------------------------------- Helpers -----------------------------------*/

async function updateKeylist() {
    const keys = await localStore.keys();
    let idx = keys.indexOf("_currentPatch");
    if(idx != -1)
        keys.splice(idx, 1);
    patchlist.set(keys);
}

/*------------------------------- Functions ----------------------------------*/

async function init() : Promise<Writable<Patch>> {
    // Does local store exist?
    const name = await localStore.getItem("_currentPatch") as string;

    if(name !== null) {
        // Get current patch and set store
        const patch = await localStore.getItem(name) as Patch;
        if(patch !== null) {
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
    store.subscribe(async (val: Patch) => {
        const name = await localStore.getItem("_currentPatch") as string;
        await localStore.setItem(name, val);
    });

    return store;
}

async function open(key: string) : Promise<boolean> {
    // Is the file in the database?
    const patch = await localStore.getItem(key) as Patch;

    if(patch === null)
        return false;   // File not found!

    // Set current patch key, THEN update store
    await localStore.setItem("_currentPatch", key);
    patch.key = key;    // Ensure key is consistent with library key
    store.set(patch);

    return true;
}

async function create(key: string, patch: Patch = DEFAULT) : Promise<boolean> {
    if(!validName(key))
        return false;

    // Add entry and update keylist
    patch.key = key;    // Ensure consistency
    await localStore.setItem(key, patch);
    await updateKeylist();

    return true;
}

function validName(name: string) : boolean {
    if(name === "")
        return false;

    const list = get(patchlist);
    if(list.includes(name))
        return false;

    return true;
}

async function remove(key: string) : Promise<boolean> {
    const name = await localStore.getItem("_currentPatch") as string;

    if(name === key)
        return false;   // Cannot delete the currently open patch

    // Remove item and update keylist
    await localStore.removeItem(key);
    updateKeylist();

    return true;
}

async function reset() : Promise<void> {
    await localStore.clear();

    // Create default storage
    for (const [key, val] of Object.entries(DEFAULT_LOCALSTORE)) {
        await localStore.setItem(key, val);
    }
    store.set(DEFAULT);

    // Update keylist
    updateKeylist();
}

async function upload(files: File[]) : Promise<void> {

}

async function download(key: string) : Promise<File> {
    return undefined;
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
