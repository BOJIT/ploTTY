<script lang="ts">
	import { onMount } from 'svelte';
	import { Component, Graph } from "noflo";

	import library from "src/svelte/store/library";
	import Input from "src/svelte/components/Input.svelte";
	import Modal from "./Modal.svelte";

	import Icon from 'svelte-awesome';
	import { faUndo } from '@fortawesome/free-solid-svg-icons';

	export let graph: Graph;
	export let selected: string;

	let ports = [];
	// graph.addInitial('true', state.selected, 'enable');

	onMount(() => {
		console.log(graph);
		let c = $library[graph.getNode(selected).component].getComponent(Component);
		for (const [key, port] of Object.entries(c.inPorts.ports) as any) {
			port.name = key;
			ports = [...ports, port];
		}
	});
</script>

<Modal title="Component Settings" confirm={false}>
	<Input placeholder ={"Label"} />

	{#each ports as port }
		<p>{port.name}</p>
	{/each}

	<br>
	<button on:click={() => {
			console.log("HEY");
		}} class="button mr-2 is-danger">
		<span class="icon"><Icon data={faUndo} /></span>
		<span>Restore Default Values</span>
	</button>
</Modal>
