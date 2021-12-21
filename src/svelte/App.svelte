<script lang="ts">
	import Navbar from "./components/Navbar.svelte";
	import Tabs from "./components/Tabs.svelte";
	// import panels from "./components/panels";
	import Popup from "./components/Popup.svelte";
	import Editor from "./components/Editor.svelte";
	import Panels from "./components/Panels.svelte";

	import { modal } from "./store/overlays";
	import editor from "./store/editor";

	/* List of current windows (global state) */
	// let tabs = [
	// 	{
	// 		title: "First Terminal",
	// 		panel: panels.Terminal
	// 	},
	// 	{
	// 		title: "Second Terminal",
	// 		panel: panels.Terminal
	// 	},
	// 	{
	// 		title: "Time Plotter",
	// 		panel: panels.PlotterTime
	// 	}
	// ];
</script>

<!-- Top navbar -->
<Navbar/>

<!-- Main tabs + panel content -->
<!-- <Tabs tabs={tabs} /> -->
<Panels/>

<!-- Editor - overlays entire page -->
<Editor hidden={!$editor.visible} locked={$editor.locked} />

<!-- Overlays -->
{#if $modal}
	<svelte:component this={$modal} />
{/if}
<Popup/>
