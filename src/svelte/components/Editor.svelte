<script lang="ts">
	/* NoFlo Imports */
	import fbpGraph from 'fbp-graph';
	import React from 'react';
	import ReactDOM from 'react-dom';
	import TheGraph from 'the-graph';

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
	let editor: HTMLElement;	// Handle to Editor DOM (React Component)

	/* Component library store */
	import library from 'src/svelte/store/library';
	let icon_library = {};

	// Load empty graph
	let graph = new fbpGraph.Graph();

	function renderEditor(redraw: boolean) {
		const props = {
			readonly: false,
			height: window.innerHeight,
			width: window.innerWidth,
			graph,
			library: icon_library,
			enableHotKeys: false, // TODO make true when editor is visible
			// selectedNodes: {}
			onNodeSelection: ((key, item, toggle) => {
				console.log(key);
				console.log(item);
				console.log(toggle);
			}),
			onEdgeSelection: ((key, item, toggle) => {
				console.log(key);
				console.log(item);
				console.log(toggle);
			})
		};

		/* If redraw is set to true, clear out and re-render the editor */
		if(redraw === true) {
			if(editor != null) {
				editor.innerHTML = '';
			}
		}

		// let t = TheGraph.App();
		// console.log(t);

		const element = React.createElement(TheGraph.App, props);
		console.log(element);
		ReactDOM.render(element, editor);
	}

	// Events on which to re-render the graph
	graph.on('endTransaction', () => renderEditor(false));
	window.addEventListener('resize', () => renderEditor(true));
	window.addEventListener('load', () => {
		library.subscribe((l) => {
			icon_library = library.generateIconLibrary(l);
			renderEditor(true);
		});
	});

	/* Graph editor functions */
	function addComponent(name: string) {
		/* Generate random ID then check that it is unique for the graph */
		let id = Math.round(Math.random() * 100000).toString(36);
		while(graph.nodes.some((node: any) => node.id === id)) {
			id = Math.round(Math.random() * 100000).toString(36);
		}

		const component = icon_library[name];

		/* Place in stack if place is taken */
		let increment: number = 0;
		while(graph.nodes.some((node: any) => node.metadata.x === (window.innerWidth/2 + increment))) {
			increment += 20;
		}

		const metadata = {
			label: component.name,
			x: window.innerWidth/2 + increment,
			y: window.innerHeight/2 + increment,
		};
		const newNode = graph.addNode(id, component.name, metadata);
		return newNode;
	};

	function clearGraph() {
		graph = new fbpGraph.Graph();
		renderEditor(false);
	}

	/* Control Overlay Functions */
	let component_selected = false;
	let extended_visible = false;
</script>

<div bind:this={editor} class="editor" class:hidden class:locked
	class:the-graph-dark="{$theme.mode === "dark"}"
	class:the-graph-light="{$theme.mode === "light"}">
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
					component_selected = !component_selected;
				}} class="button is-large is-clear">
				<span class="icon">
					<Icon data={faRedo} scale={1.75} />
				</span>
			</button>
		</div>
	{/if}

	<div class="controls">
		{#if component_selected }
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
							addComponent(sel.split('/').pop());
						})
					}
				}
			}} class="button is-large is-clear">
			<span class="icon">
				<Icon data={faPlus} scale={1.75} />
			</span>
		</button>
		<button on:click={() => {
				clearGraph();
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
