import { writable } from 'svelte/store';
import builtinComponents from 'src/editor/components';

/*---------------------------- Components Template ---------------------------*/

type UserComponent = {
	filename: string
	program: Blob
}

/* This is the actual component object tree - it is not a public store */
let component_tree = builtinComponents;

const DEFAULT_COMPONENTS: UserComponent[] = [];

const components_store = writable(DEFAULT_COMPONENTS);

function reset() {
	components_store.set(DEFAULT_COMPONENTS);
}

function getComponent(key: string) {

}

async function addComponents(files: File[]) {
	files.forEach(async (file) => {
		const url = URL.createObjectURL(file);
		console.log(url);
		let module = await import(/* webpackIgnore: true */ url);
		console.log(module);
	})
}

export default {
	subscribe: components_store.subscribe,
	set: components_store.set,
	reset,
	getComponent,
	addComponents
}