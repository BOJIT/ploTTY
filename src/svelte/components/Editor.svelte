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

	/* State variables */
	export let hidden = true;
	export let locked = false;
	let editor: HTMLElement;	// Handle to Editor DOM (React Component)

	// Component library
	const library = {
		basic: {
			name: 'basic',
			description: 'basic demo component',
			icon: 'eye',
			inports: [
			{ name: 'in0', type: 'all' },
			{ name: 'in1', type: 'all' },
			{ name: 'in2', type: 'all' },
			],
			outports: [
			{ name: 'out', type: 'all' },
			],
		},
		tall: {
			name: 'tall',
			description: 'tall demo component',
			icon: 'cog',
			inports: [
			{ name: 'in0', type: 'all' },
			{ name: 'in1', type: 'all' },
			{ name: 'in2', type: 'all' },
			{ name: 'in3', type: 'all' },
			{ name: 'in4', type: 'all' },
			{ name: 'in5', type: 'all' },
			{ name: 'in6', type: 'all' },
			{ name: 'in7', type: 'all' },
			{ name: 'in8', type: 'all' },
			{ name: 'in9', type: 'all' },
			{ name: 'in10', type: 'all' },
			{ name: 'in11', type: 'all' },
			{ name: 'in12', type: 'all' },
			],
			outports: [
			{ name: 'out0', type: 'all' },
			],
		},
	};

	// Load empty graph
	let graph = new fbpGraph.Graph();

	function renderEditor(redraw: boolean) {
		const props = {
			readonly: false,
			height: window.innerHeight,
			width: window.innerWidth,
			graph,
			library,
		};

		/* If redraw is set to true, clear out and re-render the editor */
		if(redraw === true) {
			editor.innerHTML = '';
		}

		const element = React.createElement(TheGraph.App, props);
		ReactDOM.render(element, editor);
	}

	// Events on which to re-render the graph
	graph.on('endTransaction', () => renderEditor(false));
	window.addEventListener('resize', () => renderEditor(true));
	window.addEventListener('load', () => renderEditor(true));

	// Add node button
	const addnode = function () {
		const id = Math.round(Math.random() * 100000).toString(36);
		const component = Math.random() > 0.5 ? 'basic' : 'tall';
		const metadata = {
			label: component,
			x: Math.round(Math.random() * 800),
			y: Math.round(Math.random() * 600),
		};
		const newNode = graph.addNode(id, component, metadata);
		return newNode;
	};

	// Add edge button
	const addedge = function (outNodeID) {
		const { nodes } = graph;
		const len = nodes.length;
		if (len < 1) { return; }
		const node1 = outNodeID || nodes[Math.floor(Math.random() * len)].id;
		const node2 = nodes[Math.floor(Math.random() * len)].id;
		const port1 = `out${Math.floor(Math.random() * 3)}`;
		const port2 = `in${Math.floor(Math.random() * 12)}`;
		const meta = { route: Math.floor(Math.random() * 10) };
		const newEdge = graph.addEdge(node1, port1, node2, port2, meta);
		return newEdge;
	};

	// Random graph button
	function randomGraph() {
		graph.startTransaction('randomgraph');
		for (let i = 0; i < 20; i++) {
			const node = addnode();
			addedge(node.id);
			addedge(node.id);
		}
		graph.endTransaction('randomgraph');
	}

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
				addnode();
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
