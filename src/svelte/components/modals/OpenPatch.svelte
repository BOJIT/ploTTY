<script lang="ts">
	import Modal from "./Modal.svelte";
	import Selector from "src/svelte/components/Selector.svelte";

	let files: string[] = [
		"Patch 1 - Quarter",
		"Patch 2 - Half",
		"Testing for the second time",
		"Serial Line Plotter",
		"RS485-Terminal"
	];

	function patchSelected(sel: string) {
		console.log("Selected: " + sel);
	}

	function patchDownloaded(sel: string) {
		console.log("Downloaded: " + sel);
	}

	function patchDeleted(sel: string) {
		console.log("Deleted: " + sel);
	}
</script>

<Modal title="Open Patch">
	<Selector placeholder={"File Name"} selections={files} height="12rem"
		selectionHook={patchSelected} downloadVisible={true} deleteVisible={true}
		downloadHook={patchDownloaded} deleteHook={patchDeleted} />
</Modal>
