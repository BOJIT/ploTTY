<script>
	import { afterUpdate, onDestroy } from 'svelte';

	/* NoFlo Imports */
	import ReactDOM from 'react-dom';
	import TheGraph from 'the-graph';
	import { Graph, Journal } from 'fbp-graph';

	/* Auto Layout Engine */
	import 'klayjs/klay.js';
	import KlayNoflo from 'klayjs-noflo-npm/klay-noflo.js';

	function klayjsCallback(kGraph) {
		const props = { snap: 10 };
		const children = kGraph.children.slice();

		let i;
		let len;
		for (i = 0, len = children.length; i < len; i++) {
			const klayNode = children[i];
			const fbpNode = graph.getNode(klayNode.id);

			// Encode nodes inside groups
			if (klayNode.children) {
				const klayChildren = klayNode.children;
				var idx;
				for (idx in klayChildren) {
				const klayChild = klayChildren[idx];
				if (klayChild.id) {
					graph.setNodeMetadata(klayChild.id, {
					x: Math.round((klayNode.x + klayChild.x) / props.snap) * props.snap,
					y: Math.round((klayNode.y + klayChild.y) / props.snap) * props.snap,
					});
				}
				}
			}

			// Encode nodes outside groups
			if (fbpNode) {
				graph.setNodeMetadata(klayNode.id, {
				x: Math.round(klayNode.x / props.snap) * props.snap,
				y: Math.round(klayNode.y / props.snap) * props.snap,
				});
			} else {
				// Find inport or outport
				const idSplit = klayNode.id.split(':::');
				const expDirection = idSplit[0];
				const expKey = idSplit[1];
				if (expDirection === 'inport' && graph.inports[expKey]) {
					graph.setInportMetadata(expKey, {
						x: Math.round(klayNode.x / props.snap) * props.snap,
						y: Math.round(klayNode.y / props.snap) * props.snap,
					});
				} else if (expDirection === 'outport' && graph.outports[expKey]) {
					graph.setOutportMetadata(expKey, {
						x: Math.round(klayNode.x / props.snap) * props.snap,
						y: Math.round(klayNode.y / props.snap) * props.snap,
					});
				}
			}
		}

		app.triggerFit();
	}

	const worker = new Worker('worker/klay.js');
	worker.addEventListener('message', function (e) {
		klayjsCallback(e.data);
	}, false);

	/* Public Interface */
	export let graph = new Graph();
	export let library;
	export let theme = "dark";

	let journal = new Journal(graph);	// Local journal for Undo/Redo

	export let state = {
		selected: "",
		canUndo: false,
		canRedo: false
	}

	/* Internal State */
	let container;
	let app;

	/*------------------------------------------------------------------------*/

	/* Handle component selection */
	function nodeSelectedCallback(key) {
		if(key === undefined) {
			app.refs.graph.setSelectedNodes({});
			state.selected = "";
		} else {
			let sel = {};
			sel[key] = true;
			app.refs.graph.setSelectedNodes(sel);
			state.selected = key;
		}
	}

	/* Handle edge selection */
	function edgeSelectedCallback(key) {
		// TODO
	}

	/* Handle graph change */
	graph.on('endTransaction', () => {
		if(!journal) {
			state.canUndo = false;
			state.canRedo = false;
			return;
		}
		state.canUndo = journal.canUndo;
		state.canRedo = journal.canRedo;
	});

	/*------------------------------------------------------------------------*/

	/* Re-render TheGraph component */
	function render(redraw) {
		const props = {
			readonly: false,
			height: window.innerHeight,
			width: window.innerWidth,
			graph,
			library,
			enableHotKeys: false,
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

	/* Recentre graph view */
	function recentreGraph() {
		app.triggerFit();
	}

	/* Automatically lay out graph */
	function autolayoutGraph() {
		let portInfo = app.refs.graph.getPortInfo();

		var options = {
			"intCoordinates": true,
			"algorithm": "de.cau.cs.kieler.klay.layered",
			"layoutHierarchy": true,
			"spacing": 20,
			"borderSpacing": 20,
			"edgeSpacingFactor": 0.2,
			"inLayerSpacingFactor": 2.0,
			"nodePlace": "BRANDES_KOEPF",
			"nodeLayering": "NETWORK_SIMPLEX",
			"edgeRouting": "POLYLINE",
			"crossMin": "LAYER_SWEEP",
			"direction": "RIGHT"
		};

		let kGraph = KlayNoflo.nofloToKieler(graph, portInfo, 'RIGHT');

		worker.postMessage({
			"graph": kGraph,
			"options": options
		});
	}

	/* Clear whole graph */
	function clearGraph() {
		graph = new Graph();
	}

	/* Undo last graph change */
	function undo() {
		if(!journal) {
			return;
		}
		journal.undo();
	}

	/* Redo last node change */
	function redo() {
		if(!journal) {
			return;
		}
		journal.redo();
	}

	/* Expose function API */
	export const API = {
		addComponent,
		removeComponent,
		recentreGraph,
		autolayoutGraph,
		clearGraph,
		undo,
		redo 
	}
</script>

<div bind:this={container} class:the-graph-dark="{theme === "dark"}"
							class:the-graph-light="{theme === "light"}" />