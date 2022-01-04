import { get, writable } from 'svelte/store';
import { Component } from 'noflo';
import { popup } from "./overlays";

import builtinComponents from 'src/editor/components';

/*---------------------------- Components Template ---------------------------*/

type UserComponent = {
	filename: string
	name: string
	program: Blob
}

/* This is the actual component object tree - it is not a public store */
let builtin_components = builtinComponents.map((c) => c.getComponent());

const DEFAULT_COMPONENTS: UserComponent[] = [];

const components_store = writable(DEFAULT_COMPONENTS);

function reset() {
	components_store.set(DEFAULT_COMPONENTS);
}

async function addComponents(files: File[]) {
	let components = await Promise.all(files.map(async (file) => {
		const url = URL.createObjectURL(file);
		try {
			let module = await import(/* webpackIgnore: true */ url);
			let component = module.default.getComponent(Component);
			return {
				c: component,
				f: file
			};
		} catch (error) {
			console.error("Invalid Component: " + error);
			return null;
		}
	}));

	if(components.some((c) => c === null)) {
		popup.push({
			"title": "Import Error",
			"message": "Components could not be imported!",
			"type": "error"
		});
		return;
	}

	components.forEach((c) => {
		let taken = builtin_components.some((t: any) => {
			return (t.name === c.c.name);
		});

		taken = taken || get(components_store).some((t: any) => {
			return (t.name === c.c.name);
		});

		if(taken) {
			popup.push({
				"title": "Name Clash!",
				"message": "Component names must be unique!",
				"type": "error"
			});
		} else {
			components_store.update((s) => {
				let entry = {
					filename: c.f.name,
					name: c.c.name,
					program: c.f
				}
				s.push(entry);
				return s;
			});
		}
	});
}

export default {
	subscribe: components_store.subscribe,
	set: components_store.set,
	reset,
	addComponents
}
