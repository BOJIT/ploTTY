<script lang="ts">
	import Modal from "./Modal.svelte";
	import Selector from "src/svelte/components/Selector.svelte";

	let files: string[] = [
		"Patch 1 - Quarter",
		"Patch 2 - Half",
		// "Testing for the second time",
		// "Serial Line Plotter",
		// "RS485-Terminal"
	];
</script>

<Modal title="Open Patch">
	<Selector placeholder={"File Name"} selections={files} />
</Modal>
