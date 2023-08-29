/**
 * @file logs.ts
 * @author James Bennion-Pedley
 * @brief Log dump to localstorage
 * @date 06/06/2023
 *
 * @copyright Copyright (c) 2023
 *
 */

/*-------------------------------- Imports -----------------------------------*/

import { writable, type Writable } from "svelte/store";

import localForage from "localforage";

/*--------------------------------- Types ------------------------------------*/

type LogEntry = Blob;

type Logs = {
    [key: string]: LogEntry,
};

/*--------------------------------- State ------------------------------------*/

const store: Writable<Logs> = writable({});
const localStore: LocalForage = localForage.createInstance({
    name: "logs"
});

/*------------------------------- Functions ----------------------------------*/

async function init(): Promise<Writable<Logs>> {
    // Does local store exist?
    let entry = await localStore.getItem("hardware");

    // Get localStorage if it exists
    if (entry !== null)
        store.set(entry as Logs);

    /* Local storage is subscribed to store updates */
    store.subscribe(async (val: Logs) => {
        await localStore.setItem("logs", val);
    });

    return store;
}

async function reset(): Promise<void> {
    await localStore.clear();
    store.set({});          // Reset all stores
}

/*-------------------------------- Exports -----------------------------------*/

export default {
    subscribe: store.subscribe,
    set: store.set,
    update: store.update,
    init,
    reset,
}
