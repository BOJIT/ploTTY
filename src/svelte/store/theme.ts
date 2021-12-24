/* Colourmap Themes - not accessed through CSS */

const colourmap_light = [
	"#fe4a49",
	"#fed766",
	"#226f54",
	"#3e7cb1",
	"#f17300",
	"#1e2d2f",
	"#826aed",
	"#3a506b"
];

const colourmap_dark = [
	"#ef476f",
	"#ffd166",
	"#06d6a0",
	"#118ab2",
	"#fb5607",
	"#cbf3f0",
	"#5c4d7d",
	"#729ea1"
];

/* Light/Dark Mode Control */
import { writable } from 'svelte/store';
import settings from './settings';

type Theme = {
	mode: "light" | "dark";
}

const DEFAULT_THEME: Theme = {
	mode: "dark"
};

/* Create separate theme store - this can be updated independently of settings
   by the system theme preference */
const theme_store = writable(DEFAULT_THEME);

settings.subscribe((s) => {
	switch (s.colourScheme) {
		case "light":
			theme_store.set({mode: "light"});
			break;
		
		case "dark":
			theme_store.set({mode: "dark"});
			break;

		case "auto":
			if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
				theme_store.set({mode: "dark"});
			} else {
				theme_store.set({mode: "light"});
			}
			break;
	}
});

/* Handle window theme change without page refresh */
window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', e => {
	if(e.matches) {
		theme_store.set({mode: "dark"});
	} else {
		theme_store.set({mode: "light"});
	}
});

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

function colourmap(theme: Theme, idx: number) {
	if(theme.mode === "light") {
		return colourmap_light[idx % colourmap_light.length];
	} else if(theme.mode === "dark") {
		return colourmap_dark[idx % colourmap_dark.length];
	} else {
		return 0;
	}
}

export default {
	subscribe: theme_store.subscribe,
	colourmap,
}
