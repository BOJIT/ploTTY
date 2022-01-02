import { writable } from 'svelte/store';

import { Graph } from 'fbp-graph';

/*------------------------------ Patches Template ----------------------------*/

type Patch = {
	name: string
	metadata: any
	graph: any
	window: any
}

let emptyGraphJSON = new Graph().toJSON();

/* TODO pull from examples directory */
const DEFAULT_PATCHES: Patch[] = [
	{
		name: "Example Patch 1",
		metadata: {},
		graph: emptyGraphJSON,
		window: {}
	},
	{
		name: "Example Patch 2",
		metadata: {},
		graph: emptyGraphJSON,
		window: {}
	},
	{
		name: "Example Patch 3",
		metadata: {},
		graph: emptyGraphJSON,
		window: {}
	}
];

const patches_store = writable(DEFAULT_PATCHES);

function reset() {
	patches_store.set(DEFAULT_PATCHES);
}

function newPatch(name: string) {
	patches_store.update((patches) => {
		if(patches.some((p) => p.name === name)) {
			return patches;
		} else {
			patches.push({
				name: name,
				metadata: {},
				graph: emptyGraphJSON,
				window: {}
			});
			return patches;
		}
	});
}

function deletePatch(name: string) {
	patches_store.update((patches) => {
		let match = patches.findIndex((p) => p.name === name);
		if(match !== -1) {
			patches.splice(match, 1);
			return patches;
		} else {
			console.error("No Patch with matching key found!");
			return patches;
		}
	});
}

export default {
	subscribe: patches_store.subscribe,
	set: patches_store.set,
	reset,
	newPatch,
	deletePatch
}