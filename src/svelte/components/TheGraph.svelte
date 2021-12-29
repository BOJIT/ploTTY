<script>
	import { afterUpdate, onDestroy } from 'svelte';

	/* NoFlo Imports */
	import React from 'react';
	import ReactDOM from 'react-dom';
	import TheGraph from 'the-graph';
	import fbpGraph from 'fbp-graph';

	/* Public Interface */
	export let graph = new fbpGraph.Graph();
	export let library;
	export let theme = "dark";
	
	let container; // Editor handle

	/*------------------------------------------------------------------------*/

	/* Re-render TheGraph component */
	function render(redraw) {
		const props = {
			readonly: false,
			height: window.innerHeight,
			width: window.innerWidth,
			graph,
			library,
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
			if(container != null) {
				container.innerHTML = '';
			}
		}

		ReactDOM.render(React.createElement(TheGraph.App, props), container);
	}

	/*------------------------------------------------------------------------*/

	/* Trigger React update on Svelte change */
	afterUpdate(() => {
		render(false);
	});

	/* Extra render hooks */
	graph.on('endTransaction', () => render(false));
	window.addEventListener('resize', () => render(true));

	/* Unmount Graph Component */
	onDestroy(() => {
		ReactDOM.unmountComponentAtNode(container);
	});

	/*------------------------------------------------------------------------*/

	/* Add component to graph and UI */
	function addComponent(name) {
		/* Generate random ID then check that it is unique for the graph */
		let id = Math.round(Math.random() * 100000).toString(36);
		while(graph.nodes.some((node) => node.id === id)) {
			id = Math.round(Math.random() * 100000).toString(36);
		}

		const component = library[name];

		/* Place in stack if place is taken */
		let increment = 0;
		while(graph.nodes.some((node) => node.metadata.x === 
										(window.innerWidth/2 + increment))) {
			increment += 20;
		}

		const metadata = {
			label: component.name,
			x: window.innerWidth/2 + increment,
			y: window.innerHeight/2 + increment,
		};

		graph.addNode(id, component.name, metadata);
	};

	/* Clear whole graph */
	function clearGraph() {
		graph = new fbpGraph.Graph();
	}

	/* Expose function API */
	export const API = {
		addComponent,
		clearGraph
	}
</script>

<div bind:this={container} class:the-graph-dark="{theme === "dark"}"
							class:the-graph-light="{theme === "light"}" />