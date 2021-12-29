/* Component Library Store */
import { writable } from 'svelte/store';
import { Component } from 'noflo';

import builtinComponents from 'src/editor/components';
import components from './components';

/* Populate default library */
const DEFAULT_LIBRARY: Object = {};

builtinComponents.forEach((c) => {
	let component: any = c.getComponent();
	if(component.name in DEFAULT_LIBRARY) {
		console.error("Built-in Library contains duplicate name: " + component.name);
	} else {
		DEFAULT_LIBRARY[component.name] = component;
	}
});

const library_store = writable(DEFAULT_LIBRARY);

/* Update the library whenever user components change */
components.subscribe(async (user_components) => {
	let components = await Promise.all(user_components.map(async (u) => {
		const url = URL.createObjectURL(u.program);
		try {
			let module = await import(/* webpackIgnore: true */ url);
			let component: any = module.default.getComponent(Component);
			return component;
		} catch (error) {
			console.error("Invalid Component: " + error);
			return null;
		}
	}));

	components.forEach((c) => {
		library_store.update((l) => {
			l[c.name] = c;
			return l;
		});
	});
});

/* Generate icon library from store */
function generateIconLibrary(library: any) {
	let icon_lib = {};
	for (const [, component] of Object.entries(library) as any) {
		const entry = {
			name: component.name,
			icon: component.icon,
			description: component.description,
			inports: [],
			outports: [],
		};

		const blacklist = {
			_events: "",
			_eventsCount: "",
			_maxListeners: "",
			model: "",
			ports: ""
		};

		for (const [key] of Object.entries(component.inPorts)) {
			if(!(key in blacklist)) {
				entry.inports.push({
					name: key,
					type: 'all'
				});
			}
		}

		for (const [key] of Object.entries(component.outPorts)) {
			if(!(key in blacklist)) {
				entry.outports.push({
					name: key,
					type: 'all'
				});
			}
		}

		icon_lib[component.name] = entry;
	}

	return icon_lib;
}

export default {
	subscribe: library_store.subscribe,
	set: library_store.set,
	generateIconLibrary
}