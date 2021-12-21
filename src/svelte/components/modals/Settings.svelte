<script lang="ts">
	import Modal from "./components/Modal.svelte";
	import Tabs from "src/svelte/components/Tabs.svelte";

	let tabs = [
		{
			title: "First Terminal",
			panel: null
		},
		{
			title: "Second Terminal",
			panel: null
		},
		{
			title: "Time Plotter",
			panel: null
		}
	];
</script>

<Modal title="Settings">
	<p>Settings live here...</p>

	<Tabs tabs={tabs} />
</Modal>
