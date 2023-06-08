/**
 * @file components.ts
 * @author James Bennion-Pedley
 * @brief Store containing standard and user libraries
 * @date 06/06/2023
 *
 * @copyright Copyright (c) 2023
 *
 */

/*-------------------------------- Imports -----------------------------------*/

import { writable, type Writable } from "svelte/store";

import type { PlottyComponent } from "$lib/types/plotty";

import localForage from "localforage";

import StandardLibrary from "$lib/standard-library/components";

/*--------------------------------- Types ------------------------------------*/

type ComponentLibrary = {
    [key: string]: PlottyComponent,
}

/*--------------------------------- State ------------------------------------*/

const STANDARD_LIBRARY_CATEGORIES = [
    'core',
    'data',
    'widgets',
];

const store: Writable<ComponentLibrary> = writable({});
let componentList: Writable<string[]> = writable([]);
const localStore: LocalForage = localForage.createInstance({
    name: "components"
});

/*------------------------------- Functions ----------------------------------*/

function addComponents(components: PlottyComponent[]) {
    components.forEach((c) => {
        store.update((s) => {
            s[`${c.category}/${c.name}`] = c;
            return s;
        });
    });
}

async function init(): Promise<Writable<ComponentLibrary>> {
    // Load standard library first
    addComponents(StandardLibrary);

    // Subscribe for store updates
    store.subscribe(async (val: ComponentLibrary) => {
        // TODO find out which keys have changed if

        // await localStore.setItem(`${c.category}/${c.name}`, val);
    });

    return store;
}

async function reset(): Promise<void> {
    await localStore.clear();
    store.set({});          // Reset all stores
    addComponents(StandardLibrary);
}

/*-------------------------------- Exports -----------------------------------*/

export default {
    subscribe: store.subscribe,
    set: store.set,
    update: store.update,
    init,
    reset,
}
