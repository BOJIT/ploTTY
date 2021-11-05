import { writable } from 'svelte/store';

export let modal = writable();
export let popup = writable({});   // Array of message popups
