/* Svelte store - temporary value retrieval */
import { get } from 'svelte/store';

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

function downloadFile(blob: Blob, filename: string) {
	/* Create hidden download link and programatically click */
	const url = URL.createObjectURL(blob);
	const a = document.createElement('a');
	a.href = url;
	a.download = filename || 'download';
	document.body.appendChild(a);
	a.click();
	URL.revokeObjectURL(url);
	document.body.removeChild(a);
}

function uploadFile(callback: ((files: File[]) => void), ext: string, multiple?: boolean) {
	const i = document.createElement('input');
	i.type = "file";
	i.accept = ext;
	if(multiple) {
		i.multiple = true;
	}
	document.body.appendChild(i);
	i.click();
	document.body.removeChild(i);

	/* Create hook for re-focus (if no files are added) */
	document.body.onfocus = (() => {
		document.body.onfocus = null;
		window.setTimeout(() => {
			if(i.files.length == 0) {
				callback([]);	// Pass no files to callback
				i.remove();
			}
		}, 100);
	});

	/* File upload handler */
	i.addEventListener('change', () => {
		callback(Array.from(i.files));
		i.remove();
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
	popup.push({
		"title": "Reset to Factory Default",
		"message": "All settings/patches have been removed.",
		"type": "info",
		"timeout": 5
	});
}

function importConfig() {
	uploadFile((files) => {
		if(files.length != 0) {
			const fr = new FileReader();
			fr.addEventListener("load", e => {
				// Backup existing stores - in case import partially fails
				let store_backup = {};
				for (const [key, store] of Object.entries(stores)) {
					store_backup[key] = get(store as any);
				}

				// Attempt to parse config file
				try {
					let config = JSON.parse(fr.result as string);
					for (const [key, store] of Object.entries(stores)) {
						store.set(config.config[key] as any);	
					}

					popup.push({
						"title": "Config Loaded",
						"message": "Configuration file loaded successfully!",
						"type": "info",
						"timeout": 5
					});
				} catch (error) {
					// Write back store backup
					for (const [key, store] of Object.entries(stores)) {
						store.set(store_backup[key] as any);
					}

					// Notify user of error
					popup.push({
						"title": "Import Error",
						"message": "Configuration file could not be parsed!",
						"type": "error"
					});
					console.error("Invalid Config File: " + error);
				}
			});
			fr.readAsText(files[0]);	// FileReader is callback-based
		}
	}, ".json");
}

function exportConfig() {
	let now = new Date();
	let obj = {
		exportDate: now,
		exportVersion: env.__GIT_TAG__,
		config: {}
	}

	/* Populate JSON to export */
	for (const [key, store] of Object.entries(stores)) {
		obj.config[key] = get(store as any);
	}
	
	/* Create downloadable blob */
	let filename = "ploTTY_config_" + now.getDate() + now.getMonth() + now.getFullYear() + ".json";
	const blob = new Blob([ JSON.stringify(obj) ], { type: 'application/json' });
	downloadFile(blob, filename);
}

export default {
	init,
	clear,
	importConfig,
	exportConfig
}