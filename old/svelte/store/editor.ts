import { writable } from 'svelte/store';

type EditorState = {
	visible: boolean,
	running: boolean
}

const DEFAULT_STATE: EditorState = {
	visible: false,
	running: false,
}

const editor_store = writable(DEFAULT_STATE);

function reset() {
	editor_store.set(DEFAULT_STATE);
}

/*----------------------------------------------------------------------------*/

export default {
	subscribe: editor_store.subscribe,
	set: editor_store.set,
	reset
}
