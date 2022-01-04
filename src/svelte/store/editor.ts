import { get, writable } from 'svelte/store';

import { createNetwork } from 'noflo';
import { graph as graph_api } from 'fbp-graph';

/* Subscribe dependencies */
import settings from "src/svelte/store/settings";
import patches from "src/svelte/store/patches";

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

async function runNetwork() {
	console.log("init network");

	let idx = get(patches).findIndex((p) => p.name === get(settings).currentPatch);
	if(idx !== -1) {
		let patch = get(patches)[idx];

		let graph = await graph_api.loadJSON(patch.graph);

		createNetwork(graph, {}).then((network) => {
			console.log(network);
		});

	} else {
		console.error("Patch key not found!");
	}
}

function stopNetwork() {
	console.log("stop network");
}

/*----------------------------------------------------------------------------*/

/* Keep current patch status up to date */
settings.subscribe(() => {
	let s = get(editor_store);
	if(s.running) {
		runNetwork();
	} else {
		stopNetwork();
	}
});

patches.subscribe(() => {
	let s = get(editor_store);
	if(s.running) {
		runNetwork();
	} else {
		stopNetwork();
	}
});

editor_store.subscribe((s) => {
	if(s.running) {
		runNetwork();
	} else {
		stopNetwork();
	}
});

/*----------------------------------------------------------------------------*/

export default {
	subscribe: editor_store.subscribe,
	set: editor_store.set,
	reset
}
