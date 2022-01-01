<script lang="ts">
	import Modal from "./Modal.svelte";
	import Modals from "../modals";
	import Selector from "src/svelte/components/Selector.svelte";

	import Icon from 'svelte-awesome';
	import { faFileImport, faTrash } from '@fortawesome/free-solid-svg-icons';

	import { modal } from "src/svelte/store/overlays";
	import settings from "src/svelte/store/settings";
	import patches from "src/svelte/store/patches";

	function patchSelected(sel: string) {
		$settings.currentPatch = sel;
		$modal = null;
	}

	function patchDownloaded(sel: string) {
		console.log("Downloaded: " + sel);
	}

	function patchDeleted(sel: string) {
		console.log("Deleted: " + sel);
		// TODO do not let last patch be deleted OR the current patch
	}
</script>

<Modal title="Open Patch" confirm={false}>
	<Selector placeholder={"File Name"} selections={$patches.map((p) => p.name)} height="12rem"
		selectionHook={patchSelected} downloadVisible={true} deleteVisible={true}
		downloadHook={patchDownloaded} deleteHook={patchDeleted} />

	<br>
	<button on:click={() => {
			// TODO upload custom patch to patches store
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
						// TODO remove all, restore default patches
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
