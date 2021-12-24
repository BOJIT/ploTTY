/* Local Persistent Storage */
import localForage from "localforage";

/* Import inidividually keyed svelte stores */
import settings from "./settings";
import patches from "./patches";
import components from "./components";

/* Popups */
import { popup } from "./overlays";

/* Import environment variables */
import env from 'src/env';

/* Database Index */
const stores = {
	settings: settings,
	patches: patches,
	components: components
}

/*----------------------------------------------------------------------------*/

function downloadBlob(blob: Blob, filename: string) {
	const url = URL.createObjectURL(blob);
	const a = document.createElement('a');
	a.href = url;
	a.download = filename || 'download';
	document.body.appendChild(a);
	a.click();
	URL.revokeObjectURL(url);
	document.body.removeChild(a);
}

function uploadBlob(multiple?: boolean) {
	const i = document.createElement('input');
	i.type = "file";
	i.accept = ".json";
	if(multiple) {
		i.multiple = true;
	}
	document.body.appendChild(i);
	i.click();
	document.body.removeChild(i);

	/* File upload handler */
	i.addEventListener('change', (event) => {
		console.log("test");
		// TODO delete if blob is desired file
	});
}

/*----------------------------------------------------------------------------*/

async function init() {
	// TODO replace with Promise.all() approach? Overhead is not huge currently
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
	uploadBlob();

	popup.push({
		"title": "Import Error",
		"message": "Configuration file could not be parsed!",
		"type": "error"
	});
}

async function exportJSON() {
	let now = new Date();
	let obj = {
		exportDate: now,
		exportVersion: env.__GIT_TAG__,
		config: {}
	}

	/* Populate JSON to export */
	for (const [key, store] of Object.entries(stores)) {
		let entry = await localForage.getItem(key);
		if(entry != null) {
			obj.config[key] = entry;
		}
	}
	
	let filename = "ploTTY_config_" + now.getDate() + now.getMonth() + now.getFullYear() + ".json";
	const blob = new Blob([ JSON.stringify(obj) ], { type: 'application/json' });
	downloadBlob(blob, filename);
}

export default {
	init,
	clear,
	importJSON,
	exportJSON
}