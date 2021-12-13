import { writable } from 'svelte/store';

type EditorState = {
    visible: boolean,
    locked: boolean,
}

const DEFAULT_STATE = {
    visible: false,
    locked: false,
}

const editor_store = writable(DEFAULT_STATE);

function reset() {
    editor_store.set(DEFAULT_STATE);
}

function show() {
    editor_store.update((state) => {
        state.visible = true;
        return state;
    });
}

function hide() {
    editor_store.update((state) => {
        state.visible = false;
        return state;
    });
}

function lock() {
    editor_store.update((state) => {
        state.locked = true;
        return state;
    });
}

function unlock() {
    editor_store.update((state) => {
        state.locked = false;
        return state;
    });
}

export default {
    subscribe: editor_store.subscribe,
    set: editor_store.set,
    reset,
    show,
    hide,
    lock,
    unlock
}
