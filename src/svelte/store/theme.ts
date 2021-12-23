import { writable } from 'svelte/store';

/*----------------------------------------------------------------------------*/

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

function colourmap(idx: number) {
	if(document.body.classList.contains("theme--light")) {
		return colourmap_light[idx % colourmap_light.length];
	} else if(document.body.classList.contains("theme--dark")) {
		return colourmap_dark[idx % colourmap_dark.length];
	} else {
		return 0;
	}
}

/*----------------------------------------------------------------------------*/

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

/*----------------------------------------------------------------------------*/

export default {
	subscribe: theme_store.subscribe,
	set: theme_store.set,
	reset,
	colourmap,
}
