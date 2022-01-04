import { get, writable } from 'svelte/store';

import { Graph } from 'fbp-graph';
import { popup } from "./overlays";

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

async function addPatches(files: File[]) {
	let patches = await Promise.all(files.map(async (file) => {
		let json = await file.text();
		try {
			/* Import as JSON and check for mistakes */
			let patch = JSON.parse(json);
			patch.graph;

			return patch;
		} catch (error) {
			console.error("Invalid Component: " + error);
			return null;
		}
	}));

	if(patches.some((c) => c === null)) {
		popup.push({
			"title": "Import Error",
			"message": "Patches are not valid!",
			"type": "error"
		});
		return;
	}

	patches.forEach((p) => {
		let inc = 1;
		let regex = /\((.*?)\)/;
		while(get(patches_store).some((t: any) => (t.name === p.name))) {
			/* Add numbered increment to patch name */
			let ext = regex.exec(p.name);
			if(ext && p.name.endsWith(ext[0])) {
				inc = parseInt(ext[1]) + 1;
				p.name = p.name.slice(0, -(ext[0].length + 1))
			}
			p.name = p.name + " (" + inc + ")";
		}

		patches_store.update((s) => {
			s.push(p);
			return s;
		});
	});
}

export default {
	subscribe: patches_store.subscribe,
	set: patches_store.set,
	reset,
	newPatch,
	deletePatch,
	addPatches
}
