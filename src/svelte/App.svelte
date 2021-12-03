<script lang="ts">
	import Navbar from "./components/Navbar.svelte";
	import Tabs from "./components/Tabs.svelte";
	import Panels from "./components/panels";
	import Popup from "./components/Popup.svelte";

	import { modal } from "./store/overlays";

	/* List of current windows (global state) */
	let tabs = [
		{
			title: "First Terminal",
			panel: Panels.Terminal
		},
		{
			title: "Second Terminal",
			panel: Panels.Terminal
		},
		{
			title: "Time Plotter",
			panel: Panels.PlotterTime
		}
	];
</script>

<!-- Top Navbar -->
<Navbar/>

<!-- Main Tabs + Panel content -->
<Tabs tabs={tabs} />

<!-- Overlays -->
{#if $modal}
	<svelte:component this={$modal} />
{/if}

<!-- TODO add popups here -->
<Popup />
