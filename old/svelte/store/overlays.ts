import { writable } from 'svelte/store';

/* Modal Overlay */
export let modal: any = writable();

/* Popup Overlays */
type Popup = {
    title: string,
    message: string,
    type: "info" | "warning" | "error"
    timeout?: number
    uid?: number
}

const popup_store = writable([]);   // Array of message popups
let popup_uid = 1;

function popupReset() {
    popup_store.set([])
}

function popupClose(uid: number) {
    popup_store.update((popups) => {
        return popups.filter(t => t.uid !== uid);
    });
}

function popupPush(entry: Popup) {
    popup_store.update((popups) => {
        entry.uid = popup_uid++;
        popups = [entry, ...popups];
        /* Auto-remove from store if timeout specified */
        if("timeout" in entry) {
            setTimeout(() => popupClose(entry.uid), entry.timeout*1000);
        }
        return popups;
    });
}

export let popup = {
    subscribe: popup_store.subscribe,
    set: popup_store.set,
    reset: popupReset,
    close: popupClose,
    push: popupPush
}
