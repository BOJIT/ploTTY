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

export default {
	subscribe: patches_store.subscribe,
	set: patches_store.set,
	reset,
}