<script lang="ts">
	/* Font Awesome */
	import Icon from 'svelte-awesome';
	import { faTimes, faSearch, faFileExport, faTrash } from '@fortawesome/free-solid-svg-icons';

	/* Custom Scrollbar */
	import 'simplebar';
	import 'simplebar/dist/simplebar.css';

	/* External Props */
	export let placeholder: string = "Placeholder";
	export let selections: string[];
	export let height: string = "7rem";

	/* Button Hooks and Visibility */
	export let downloadVisible = false;
	export let deleteVisible = false;

	export let selectionHook: ((sel: string) => void) = () => {};
	export let downloadHook: ((sel: string) => void) = () => {};
	export let deleteHook: ((sel: string) => void) = () => {};
	
	/* Word Match Highlighting */
	import Mark from 'mark.js/dist/mark.es6.min.js';
	import { onMount } from 'svelte';

	let selector: HTMLElement;
	let instance: any = undefined;
	onMount(() => {
		instance = new Mark(selector);
	});

	/* Searchbox Filtering */
	let search = "";
	let numMatches: number = selections.length;

	function inputChange() {
		/* Highlight Matches */
		if(instance) {
			instance.unmark({
				done: () => {
					instance.mark(search);
				}
			});
		}

		/* Get number of matches */
		numMatches = selections.filter(s => s.toLowerCase().includes(search.toLowerCase())).length;
	}

	function searchSelections(current: string, filter: string) {
		/* Show if current length matches */
		if(current.toLowerCase().includes(filter.toLowerCase())) {
			return true;
		} else {
			return false;
		}
	}

	function clearSearch() {
		search = "";
		inputChange();	// Is not automatically called
	}
</script>

<div class="field mb-0">
	<p class="control has-icons-left has-icons-right">
		<input bind:value={search} on:input={inputChange}
			class:is-danger={numMatches == 0} class:is-success={numMatches == 1}
			class="input" placeholder="{placeholder}">
		<span class="icon is-small is-left">
			<Icon data={faSearch} />
		</span>
		<span on:click={clearSearch} class="icon is-small is-right">
			<Icon data={faTimes} />
		</span>
	</p>
</div>
<div bind:this={selector} class="selector" style="max-height: {height}" data-simplebar>
	{#each selections.sort() as selection}
		{#if searchSelections(selection, search)}
			<div class="selection button">
				<button on:click={() => {
					selectionHook(selection);
				}} class="button" class:is-left={downloadVisible || deleteVisible}>
					<h3>{selection}</h3>
				</button>
				{#if downloadVisible}
					<button on:click={() => {
							downloadHook(selection);
						}} class="button">
						<span class="icon"><Icon data={faFileExport} /></span>
					</button>
				{/if}
				{#if deleteVisible}
					<button on:click={() => {
							deleteHook(selection);
						}} class="button">
						<span class="icon"><Icon data={faTrash} /></span>
					</button>
				{/if}
			</div>
		{/if}
	{/each}
</div>

<style lang="scss">
	@charset "utf-8";
	@use "src/styles/_constants.scss";
	@use "src/styles/theme.scss";

	.selector {
		overflow-y: scroll;
		scrollbar-width: none;
	}

	.selector::-webkit-scrollbar {
		display: none;
	}

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
	}

	.selection > button:first-child {
		flex-grow: 1;
	}

	.selection:hover {
		@include theme.themed() {
			background-color: theme.t(theme.$background-overlay-hover);
		}
	}

	.selection > .button {
		border-radius: 0px;
	}

	.selection > .button:hover {
		@include theme.themed() {
			background-color: theme.t(theme.$background-overlay-hover);
		}
	}

	.input {
		border-radius: 0px;
		@include theme.themed() {
			background-color: theme.t(theme.$background-primary);
			color: theme.t(theme.$text-secondary);
		}
	}

	.input::placeholder {
		@include theme.themed() {
			color: theme.t(theme.$background-overlay-hover);
		}
	}

	.icon {
		@include theme.themed() {
			color: theme.t(theme.$text-secondary);
		}
	}

	.input:focus {
		@include theme.themed() {
			color: theme.t(theme.$text-primary);
		}
	}
	
	.input:focus ~ .icon {
		@include theme.themed() {
			color: theme.t(theme.$text-primary);
		}
	}

	.icon.is-right {
		pointer-events: auto !important;
	}

	.icon.is-right:hover {
		@include theme.themed() {
			color: theme.t(theme.$background-overlay-hover);
		}
	}
</style>
