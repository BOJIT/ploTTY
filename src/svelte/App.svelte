<script lang="ts">
	/* UI Components */
	import Navbar from "./components/Navbar.svelte";
	import Popup from "./components/Popup.svelte";
	import Editor from "./components/Editor.svelte";
	import TiledPanels from "./components/TiledPanels.svelte";

	/* Environment Variables */
	import env from "src/env";

	/* Svelte stores */
	import { modal } from "./store/overlays";

	/* Initialise local storage */
	import storage from "./store/storage";
	storage.init();

	/* List of current panels (global state) */
	let panels = [
		{
			title: "First Terminal",
			panel: "Terminal"
		},
		{
			title: "Second Terminal",
			panel: "Terminal"
		},
		{
			title: "Time Plotter",
			panel: "PlotterTime"
		}
	];

	if(env.__MODE__ === "production") {
		if ('serviceWorker' in navigator) {
			// Use the window load event to keep the page load performant
			window.addEventListener('load', () => {
				navigator.serviceWorker.register('/service-worker.js').catch((err) => {
					console.warn("SW registration failed with error " + err);
				});
			});
		}
	}
</script>

<!-- Top navbar -->
<Navbar/>

<!-- Main tabs + panel content -->
<TiledPanels currentPanels={panels} />

<!-- Editor - overlays entire page -->
<Editor/>

<!-- Overlays -->
{#if $modal}
	{#if $modal.props }
		<svelte:component this={$modal.component} {...$modal.props} />
	{:else}
		<svelte:component this={$modal} />
	{/if}
{/if}
<Popup/>
