<script lang="ts">
	import Navbar from "./components/Navbar.svelte";
	import Popup from "./components/Popup.svelte";
	import Editor from "./components/Editor.svelte";
	import Panels from "./components/Panels.svelte";

	import { modal } from "./store/overlays";
	import editor from "./store/editor";

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
	<svelte:component this={$modal} />
{/if}
<Popup/>
