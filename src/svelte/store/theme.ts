import { writable } from 'svelte/store';

type Theme = {
	mode: "light" | "dark";
}

const DEFAULT_THEME: Theme = {
	mode: "dark"
};

const theme_store = writable(DEFAULT_THEME);

theme_store.subscribe((theme) => {
	/* Global theme setting */
	if(theme.mode === "light") {
		document.body.classList.add("theme--light");
		document.body.classList.remove("theme--dark");
	} else if(theme.mode === "dark") {
		document.body.classList.add("theme--dark");
		document.body.classList.remove("theme--light");
	}
});

function reset() {
	theme_store.set(DEFAULT_THEME);
}

export default {
	subscribe: theme_store.subscribe,
	set: theme_store.set,
	reset
}
