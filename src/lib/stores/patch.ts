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

import { writable, type Writable } from "svelte/store";

import { Graph } from "fbp-graph";
import type { GraphJson } from "fbp-graph/lib/Types";

/*--------------------------------- Types ------------------------------------*/

type Patch = {
    key?: string    // Duplicate of library key (useful for comprehensions)
    metadata: any
    graph: GraphJson
};

type PatchLibrary = {
    _currentPatch: string,
    [key:string]: Patch,
}

/*--------------------------------- State ------------------------------------*/

let store: Writable<Patch> = writable();

/*------------------------------- Functions ----------------------------------*/

async function init() : Promise<Writable<Patch>> {
    // Does local store exist?

    return store;
}

function list() : string[] {
    return [];
}

function open(key: string) : boolean {
    return true;
}

async function remove(key:string) : Promise<boolean> {
    return true;
}

function upload(key: string, file: File) {

}

function download(key: string) {

}

async function reset() {

}

/*-------------------------------- Exports -----------------------------------*/

export default {
    subscribe: store.subscribe,
    set: store.set,
    update: store.update,
}
