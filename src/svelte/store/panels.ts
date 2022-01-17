/* Panel Object Store */
import type { SvelteComponent } from 'svelte';
import { writable } from 'svelte/store';

export type PanelData = {
	id: string,
	port: string,
	data: any
}

export type PanelHandle = {
	id: string,
	panel: SvelteComponent
}

const DEFAULT_PANELS: Array<PanelHandle> = [];

const panel_store = writable(DEFAULT_PANELS);

panel_store.subscribe((p) => {
	console.log(p);
});

function panelUpdate(data: PanelHandle) {
	console.log(data);
}

export default {
	subscribe: panel_store.subscribe,
	set: panel_store.set,
	panelUpdate
}
