import { writable } from 'svelte/store';

/*---------------------------- Components Template ---------------------------*/

type Component = {
	name: string
	category: "Core" | "Data" | "Panel" | "User"
	program: string // TEMP
}

const DEFAULT_COMPONENTS: Component[] = [];

const components_store = writable(DEFAULT_COMPONENTS);

function reset() {
	components_store.set(DEFAULT_COMPONENTS);
}

function generateLibrary() {

}

export default {
	subscribe: components_store.subscribe,
	set: components_store.set,
	reset,
}