/* Local Persistent Storage */
import localForage from "localforage";

/* Import inidividually keyed svelte stores */
import settings from "./settings";
import patches from "./patches";
import components from "./components";

/* Database Index */
const stores = {
	settings: settings,
	patches: patches,
	components: components
}

async function init() {
	for (const [key, store] of Object.entries(stores)) {
		/* Pull entry from local storage */
		let entry = await localForage.getItem(key);
		if(entry != null) {
			store.set(entry as any);
		}

		/* Local storage is subscribed to store updates */
		store.subscribe((val: any) => {
			localForage.setItem(key, val);
		}); 
	}
}

function clear() {
	localForage.clear();	// Clear local Storage
	for (const [, store] of Object.entries(stores)) {
		store.reset();		// Reset all stores
	}
}

function importJSON() {

}

function exportJSON() {

}

export default {
	init,
	clear,
	importJSON,
	exportJSON
}