<script lang="ts">
	import Modal from "./Modal.svelte";
	import Selector from "src/svelte/components/Selector.svelte";

	import library from "src/svelte/store/library";

	export let addHook: ((index: string) => void) = (() => {});

	let components: string[] = [];
	for (const [, component] of Object.entries($library) as any) {
		components.push(component.category + "/" + component.name);
	}
</script>

<Modal title="Add Component" confirm={false}>
	<Selector placeholder={"Component Name"} selections={components}
		height="12rem" selectionHook={addHook} />
</Modal>
