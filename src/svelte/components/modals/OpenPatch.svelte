<script lang="ts">
	import Modal from "./Modal.svelte";
	import Modals from "../modals";
	import Selector from "src/svelte/components/Selector.svelte";

	import Icon from 'svelte-awesome';
	import { faFileImport, faTrash } from '@fortawesome/free-solid-svg-icons';

	import { modal, popup } from "src/svelte/store/overlays";
	import settings from "src/svelte/store/settings";
	import patches from "src/svelte/store/patches";
	import storage from "src/svelte/store/storage";

	function patchSelected(sel: string) {
		$settings.currentPatch = sel;
		$modal = null;
	}

	function patchDownloaded(sel: string) {
		const patch = $patches.find((p) => p.name === sel);
		const blob = new Blob([ JSON.stringify(patch) ], { type: 'application/json' });
		storage.downloadFile(blob, sel + ".plotty.json");
	}

	function patchDeleted(sel: string) {
		if($settings.currentPatch === sel) {
			popup.push({
				"title": "Warning!",
				"message": "Cannot delete currently active patch!",
				"type": "warning",
				"timeout": 3
			});
		} else {
			patches.deletePatch(sel);
		}
	}
</script>

<Modal title="Open Patch" confirm={false}>
	<Selector placeholder={"File Name"} selections={$patches.map((p) => p.name)} height="12rem"
		selectionHook={patchSelected} downloadVisible={true} deleteVisible={true}
		downloadHook={patchDownloaded} deleteHook={patchDeleted} />

	<br>
	<button on:click={() => {
			storage.uploadFile(patches.addPatches, ".plotty.json", true);
		}} class="button mr-2">
		<span class="icon"><Icon data={faFileImport} /></span>
		<span>Upload</span>
	</button>
	<button on:click={() => {
			$modal = {
				component: Modals.Confirm,
				props: {
					title: "Restore Default Patches",
					confirmHook: (() => {
						patches.reset();
						$settings.currentPatch = $patches[0].name;
						$modal = Modals.OpenPatch;
					}),
					cancelHook: (() => {
						$modal = Modals.OpenPatch;
					})
				}
			};
		}} class="button mr-2 is-danger">
		<span class="icon"><Icon data={faTrash} /></span>
		<span>Restore Defaults</span>
	</button>
</Modal>
