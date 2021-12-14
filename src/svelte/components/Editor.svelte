<script lang="ts">
	import fbpGraph from 'fbp-graph';
	import React from 'react';
	import ReactDOM from 'react-dom';
	import TheGraph from 'the-graph';

	import theme from 'src/svelte/store/theme';

	// require('font-awesome/css/font-awesome.css');

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

</script>

<div bind:this={editor} class="editor" class:hidden class:locked
	class:the-graph-dark="{$theme.mode === "dark"}"
	class:the-graph-light="{$theme.mode === "light"}">
</div>

<div class="testing" class:hidden class:locked>
	<button id="random" on:click="{randomGraph}"><i class="fa fa-random"></i> random graph</button>
	<button id="addnode" on:click="{addnode}">add node</button>
	<button id="addedge" on:click="{addedge}">add edge</button>
	<button id="clear" on:click="{clearGraph}"><i class="fa fa-trash"></i> clear</button>
</div>

<style lang="scss">
	@charset "utf-8";
	@use "src/scss/_constants.scss";
	@use "src/scss/theme.scss";

	.hidden {
		display: none;
	}

	.locked {
		pointer-events: none;
	}

	.editor {
		height: 100%;
		width: 100%;
		position: absolute;
		z-index: 10;
	}

	.testing {
		position: absolute;
		bottom: 0;
		left: 0;
		z-index: 11;
	}
</style>
