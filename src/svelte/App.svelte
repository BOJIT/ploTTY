<script lang="ts">
	/* UI Components */
	import Navbar from "./components/Navbar.svelte";
	import Popup from "./components/Popup.svelte";
	import Editor from "./components/Editor.svelte";
	import Panels from "./components/Panels.svelte";

	/* Svelte stores */
	import { modal } from "./store/overlays";
	import editor from "./store/editor";

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
</script>

<!-- Top navbar -->
<Navbar/>

<!-- Main tabs + panel content -->
<Panels currentPanels={panels} />

<!-- Editor - overlays entire page -->
<Editor hidden={!$editor.visible} locked={$editor.locked} />

<!-- Overlays -->
{#if $modal}
	{#if $modal.props }
		<svelte:component this={$modal.component} {...$modal.props} />
	{:else}
		<svelte:component this={$modal} />
	{/if}
{/if}
<Popup/>
