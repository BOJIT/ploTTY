<script>
	import { afterUpdate, onDestroy } from 'svelte';

	/* NoFlo Imports */
	import ReactDOM from 'react-dom';
	import TheGraph from 'the-graph';
	import { Graph } from 'fbp-graph';

	/* Public Interface */
	export let graph = new Graph();
	export let library;
	export let theme = "dark";
	export let selected = "";

	/* Internal State */
	let container;
	let app;

	/*------------------------------------------------------------------------*/

	/* Handle component selection */
	function nodeSelectedCallback(key) {
		if(key === undefined) {
			app.refs.graph.setSelectedNodes({});
			selected = "";
		} else {
			let sel = {};
			sel[key] = true;
			app.refs.graph.setSelectedNodes(sel);
			selected = key;
		}
	}

	function edgeSelectedCallback(key) {
		// TODO
	}

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
			onNodeSelection: nodeSelectedCallback,
			onEdgeSelection: ((key, item, toggle) => {}),
		};

		/* If redraw is set to true, clear out and re-render the editor */
		if(redraw === true) {
			if(container != null) {
				container.innerHTML = '';
			}
		}

		app = ReactDOM.render(TheGraph.App(props), container);
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

		/* Reset any component selections */
		app.unselectAll();
	};

	/* Remove component from graph and UI */
	function removeComponent(id) {
		/* Reset any component selections */
		app.unselectAll();

		graph.removeNode(id);
	}

	/* Clear whole graph */
	function clearGraph() {
		graph = new Graph();
	}

	/* Expose function API */
	export const API = {
		addComponent,
		removeComponent,
		clearGraph
	}
</script>

<div bind:this={container} class:the-graph-dark="{theme === "dark"}"
							class:the-graph-light="{theme === "light"}" />