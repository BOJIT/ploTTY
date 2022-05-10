import { writable } from 'svelte/store';

/*--------------------------- Settings File Template -------------------------*/

type Settings = {
    colourScheme: "light" | "dark" | "auto"
    currentPatch: string
    logList: string[]
}

const DEFAULT_SETTINGS: Settings = {
    colourScheme: "dark",
    currentPatch: "Example Patch 1",    // TODO change to set of example graphs
    logList: []
}
/* TODO add examples in default store */

const settings_store = writable(DEFAULT_SETTINGS);

function reset() {
    settings_store.set(DEFAULT_SETTINGS);
}

export default {
    subscribe: settings_store.subscribe,
    set: settings_store.set,
    reset,
}