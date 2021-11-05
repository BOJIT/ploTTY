<script lang="ts">
	import Navbar from "./Navbar.svelte";
	import Tabs from "./Tabs.svelte";
	import Panels from "./panels";

	import { modal, popup } from "./store/overlays";

	/* List of current windows (global state) */
	let tabs = [
		{
			title: "Editor",
			panel: Panels.Editor
		},
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
