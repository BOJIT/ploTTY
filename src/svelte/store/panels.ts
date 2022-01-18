/* Panel Object Store */
import type { SvelteComponent } from 'svelte';
import { get, writable } from 'svelte/store';

export type PanelData = {
	id: string,
	port: string,
	data: any
}

export type PanelHandle = {
	panel: SvelteComponent,
	title: string,
	instance: undefined | any
}

const DEFAULT_PANELS: Object = {};

const panel_store = writable(DEFAULT_PANELS);

function panelUpdate(data: PanelData) {
	let panel = get(panel_store)[data.id];

	if(panel === undefined) {
		console.error("PanelUpdate() packet could not be routed!");
	} else {
		if(panel.instance !== undefined) {
			panel.instance.update(data);
		} else {
			console.error('no instance');
		}
	}
}

export default {
	subscribe: panel_store.subscribe,
	set: panel_store.set,
	update: panel_store.update,
	panelUpdate
}
