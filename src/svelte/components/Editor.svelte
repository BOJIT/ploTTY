<script lang="ts">
	/* TheGraph Editor */
	import TheGraph from 'src/svelte/components/TheGraph.svelte';

	/* Themes and UI */
	import theme from 'src/svelte/store/theme';
	import Icon from 'svelte-awesome';
	import { fly } from 'svelte/transition';
	import { faCog, faEllipsisH, faExpand, faMagic, faPlus, faRedo, faTimes, faTrash, faUndo } from '@fortawesome/free-solid-svg-icons';

	/* Overlays */
	import { modal } from 'src/svelte/store/overlays';
	import Modal from 'src/svelte/components/modals';

	/* State variables */
	export let hidden = true;
	export let locked = false;

	/* Component library store */
	import library from 'src/svelte/store/library';

	// Load empty graph
	let graph: any;
	let API: any;
	let selected: string;

	/* Control Overlay Functions */
	let extended_visible = false;
</script>

<div class="editor" class:hidden class:locked >
	<TheGraph theme={$theme.mode} bind:graph={graph} bind:API={API}
		bind:selected={selected} library={library.generateIconLibrary($library)} />
</div>

<div class:hidden class:locked>
	{#if extended_visible }
		<div transition:fly="{{ x:100 }}" class="controls extended">
			<button on:click={() => {
				}} class="button is-large is-danger">
				<span class="icon">
					<Icon data={faTimes} scale={1.75} />
				</span>
			</button>
			<button on:click={() => {
				}} class="button is-large is-clear">
				<span class="icon">
					<Icon data={faMagic} scale={1.75} />
				</span>
			</button>
			<button on:click={() => {
				}} class="button is-large is-clear">
				<span class="icon">
					<Icon data={faUndo} scale={1.75} />
				</span>
			</button>
			<button on:click={() => {
				}} class="button is-large is-clear">
				<span class="icon">
					<Icon data={faRedo} scale={1.75} />
				</span>
			</button>
		</div>
	{/if}

	<div class="controls">
		{#if selected !== "" }
			<button transition:fly="{{ y:100 }}" on:click={() => {
				}} class="button is-large is-clear">
				<span class="icon">
					<Icon data={faCog} scale={1.75} />
				</span>
			</button>
			<button transition:fly="{{ y:100 }}" on:click={() => {
				}} class="button is-large is-clear">
				<span class="icon">
					<Icon data={faTrash} scale={1.75} />
				</span>
			</button>
		{/if}

		<button on:click={() => {
				$modal = {
					component: Modal.AddComponent,
					props: {
						addHook: ((sel) => {
							$modal = null;
							API.addComponent(sel.split('/').pop());
						})
					}
				}
			}} class="button is-large is-clear">
			<span class="icon">
				<Icon data={faPlus} scale={1.75} />
			</span>
		</button>
		<button on:click={() => {
				API.clearGraph();
			}} class="button is-large is-clear">
			<span class="icon">
				<Icon data={faExpand} scale={1.75} />
			</span>
		</button>
		<button on:click={() => {
				extended_visible = !extended_visible;
			}} class="button is-large is-clear">
			<span class="icon">
				<Icon data={faEllipsisH} scale={1.75} />
			</span>
		</button>
	</div>
</div>

<style lang="scss">
	@charset "utf-8";
	@use "src/styles/_constants.scss";
	@use "src/styles/theme.scss";

	/* State Styling */
	.hidden {
		display: none;
	}

	.locked {
		pointer-events: none;
	}

	/* Editor/NoFlo Styling */
	.editor {
		height: 100%;
		width: 100%;
		position: absolute;
		z-index: 10;
	}

	/* Overlay Styling */
	.controls {
		position: absolute;
		bottom: 2rem;
		right: 2rem;
		z-index: 20;
		display: flex;
		flex-direction: column;
		gap: 1rem
	}

	.controls .button {
		border-radius: 50%;
	}

	.controls.extended {
		right: 7rem;
		flex-direction: row;
	}

	/* Button Styling */
	.button:focus {
		outline: none;
		box-shadow: none;
	}

	.button.is-clear {
		@include theme.themed() {
			background-color: theme.t(theme.$background-overlay);
		}
		border: none;
	}

	.button.is-clear:hover {
		@include theme.themed() {
			background-color: theme.t(theme.$background-overlay-hover);
		}
	}

	.icon {
		@include theme.themed() {
			color: theme.t(theme.$text-primary);
		}
	}
</style>
