<script lang="ts">
	import { onMount } from 'svelte';
	import { Component, Graph } from "noflo";

	import library from "src/svelte/store/library";
	import Input from "src/svelte/components/Input.svelte";
	import Modal from "./Modal.svelte";

	import Icon from 'svelte-awesome';
	import { faArrowCircleRight, faCaretSquareDown, faCode, faUndo } from '@fortawesome/free-solid-svg-icons';

	export let graph: Graph;
	export let selected: string;

	let ports = [];
	// graph.addInitial('true', state.selected, 'enable');

	onMount(() => {
		let c = $library[graph.getNode(selected).component].getComponent(Component);
		for (const [key, port] of Object.entries(c.inPorts.ports) as any) {
			port.name = key;
			ports = [...ports, port];
		}
	});
</script>

<Modal title="Component Settings" confirm={false}>
	<h3>Component Name</h3>
	<Input placeholder ={"Label"} />

	<br>

	{#each ports as port }
		<div class="selection button">
			<button class="button is-left" style="pointer-events:none">
				<h3>{port.name}</h3>
			</button>
			<button on:click={() => {
					// downloadHook(selection);
				}} class="button thru">
				<span class="icon"><Icon data={faArrowCircleRight} /></span>
			</button>
			<button on:click={() => {
					// deleteHook(selection);
				}} class="button enum">
				<span class="icon"><Icon data={faCaretSquareDown} /></span>
			</button>
			<button on:click={() => {
					// deleteHook(selection);
				}} class="button const">
				<span class="icon"><Icon data={faCode} /></span>
			</button>
		</div>
	{/each}

	<br><br>
	<button on:click={() => {
			console.log("HEY");
		}} class="button mr-2 is-danger">
		<span class="icon"><Icon data={faUndo} /></span>
		<span>Restore Default Values</span>
	</button>
</Modal>

<style lang="scss">
	@charset "utf-8";
	@use "src/styles/_constants.scss";
	@use "src/styles/theme.scss";
	@use "sass:list";

	.selection {
		width: 100%;
		border-radius: 0px;
		padding: 0px;
	}

	.selection > button {
		flex: 0 0 auto;
		height: 100%;
		display: flex;
		align-items: center;
		border: none;
	}

	.selection > button.is-left {
		justify-content: left;
		text-align: left;
	}

	.selection > button:first-child {
		flex-grow: 1;
	}

	.selection > button {
		border-radius: 0px;
	}

	/* Selector colouring */

	.selection > .button:not(:first-child):not(:hover) {
		border-radius: 0px;
		@include theme.themed() {
			filter: brightness(theme.t(theme.$filter-inactive)) saturate(30%);
		}
	}

	.selection > .button.thru {
		@include theme.themed() {
			background-color: theme.t(theme.$background-info);
		}
	}

	.selection > .button.enum {
		@include theme.themed() {
			background-color: theme.t(theme.$background-success);
		}
	}

	.selection > .button.const {
		@include theme.themed() {
			background-color: theme.t(theme.$background-warning);
		}
	}

</style>
