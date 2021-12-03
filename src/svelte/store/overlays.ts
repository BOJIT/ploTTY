import { writable } from 'svelte/store';

/* Modal Overlay */
export let modal = writable();

/* Popup Overlays */

type Popup = {
    title: string,
    message: string,
    type: "info" | "warning" | "error"
    timeout?: number
}

const popup_store = writable([]);   // Array of message popups

function popupPush(entry: Popup) {
    popup_store.update((popups) => {
        popups = [...popups, entry];
        return popups;
    });
}

function popupReset() {
    popup_store.set([])
}

export let popup = {
    subscribe: popup_store.subscribe,
    reset: popupReset,
    push: popupPush
}
