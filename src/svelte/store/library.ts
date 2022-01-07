/* Component Library Store */
import { writable } from 'svelte/store';
import { Component, ComponentLoader } from 'noflo';

import builtinComponents from 'src/editor/components';
import components from './components';

/* Populate default library */
const DEFAULT_LIBRARY: Object = {};

builtinComponents.forEach((component) => {
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
			let component: any = module.default;
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

/*---------------------------------- Helpers ---------------------------------*/

/* Generate icon library from store */
function generateIconLibrary(library: any) {
	let icon_lib = {};
	for (const [, component] of Object.entries(library) as any) {
		const instance = component.getComponent(Component);
		const entry = {
			name: instance.name,
			icon: instance.icon,
			description: instance.description,
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

		for (const [key] of Object.entries(instance.inPorts)) {
			if(!(key in blacklist)) {
				entry.inports.push({
					name: key,
					type: 'all'
				});
			}
		}

		for (const [key] of Object.entries(instance.outPorts)) {
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

/*----------------------------- Component Loader -----------------------------*/

class Loader extends ComponentLoader {
	constructor() {
		super('/', {}); // call the super class constructor

		/* Add default library to loader */
		this.components = {};
		for (const [key, component] of Object.entries(DEFAULT_LIBRARY)) {
			this.components[key] = component;
		};

		/* Set the components as loaded */
		this.ready = true;
	}

	load(name:string) {
		const promise = new Promise((resolve, reject) => {
			if (!this.components) {
				reject(new Error(`Component tree not initialised!`));
				return;
			}

			let component = this.components[name];

			if (!component) {
				// Failure to load
				reject(new Error(`Component ${name} not available!`));
				return;
			}
			resolve(component);
		}).then((component: any) => {
			let instance = component.getComponent(Component);
			return instance;
		});
		return promise;
	}

	// TODO add ability to load graph as a component
}

const loader = new Loader();

// TODO subscribe to library and update loader

/*----------------------------------------------------------------------------*/

export default {
	subscribe: library_store.subscribe,
	set: library_store.set,
	generateIconLibrary,
	loader
}
