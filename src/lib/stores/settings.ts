/**
 * @file settings.ts
 * @author James Bennion-Pedley
 * @brief Handles settings synchronisation with IndexedDB
 * @date 09/02/2023
 *
 * @copyright Copyright (c) 2023
 *
 */

/*-------------------------------- Imports -----------------------------------*/

import { writable, type Writable } from "svelte/store";

import localForage from "localforage";

import type { ThemeMode } from "@bojit/svelte-components/theme/theme";

/*--------------------------------- Types ------------------------------------*/

type Settings = {
    theme: ThemeMode,
    switches: {
        clearWidgetsOnStart: boolean,
        lowGraphicsMode: boolean,
    }
};

/*--------------------------------- State ------------------------------------*/

const DEFAULT: Settings = {
    theme: 'dark',
    switches: {
        clearWidgetsOnStart: true,
        lowGraphicsMode: false,
    }
}

const store: Writable<Settings> = writable(DEFAULT);
const localStore: LocalForage = localForage.createInstance({
    name: "settings"
});

/*------------------------------- Functions ----------------------------------*/

async function init(): Promise<Writable<Settings>> {
    // Does local store exist?
    let entry = await localStore.getItem("settings");

    // Get localStorage if it exists
    if (entry !== null)
        store.set(entry as Settings);

    /* Local storage is subscribed to store updates */
    store.subscribe(async (val: Settings) => {
        await localStore.setItem("settings", val);
    });

    return store;
}

async function reset(): Promise<void> {
    await localStore.clear();
    store.set(DEFAULT);          // Reset all stores
}

/*-------------------------------- Exports -----------------------------------*/

export default {
    subscribe: store.subscribe,
    set: store.set,
    update: store.update,
    init,
    reset,
}
