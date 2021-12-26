<script lang="ts">
	import Modal from "./Modal.svelte";

	export let title = "Confirm Removal";
	export let confirmHook: (() => void) = (() => {});
	export let cancelHook: (() => void) = (() => {});
</script>

<Modal title={title} confirmHook={confirmHook} cancelHook={cancelHook}>
	<h3>Are you sure you want to continue?</h3>
</Modal>
