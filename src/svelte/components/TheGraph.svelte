<script>
	/* Svelte Core */
	import { afterUpdate, onDestroy } from 'svelte';
	import { createEventDispatcher } from 'svelte';
	const dispatch = createEventDispatcher();

	/* NoFlo Imports */
	import ReactDOM from 'react-dom';
	import TheGraph from 'the-graph';
	import { Graph, graph as graph_api } from 'fbp-graph';

	/* Internal State */
	let container;
	let app;
	let history = []; let revision = 0;

	/* Auto Layout Engine */
	import KlayNoflo from 'klayjs-noflo-npm/klay-noflo.js';

	/* Initialise worker if URL provided */
	let worker = null;
	function klayjsInit(url) {
		if((url !== "") && (worker === null)) {
			worker = new Worker(url);
			worker.addEventListener('message', function (e) {
				klayjsCallback(e.data);
			}, false);
		}
	}

	function klayjsCallback(kGraph) {
		// Back up old history
		let old_history = history.slice();

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

		// Load single-change history tree
		let last_change = history.pop();
		history = old_history.slice();

		history.push(last_change);
		if(history.length > 10) {
			history.shift();
		}
		revision = history.length - 1;

		app.triggerFit();
	}

	/* Public Interface */
	export let graph = new Graph();
	export let library;
	export let theme = "dark";
	export let workerURL = "";

	export let state = {
		selected: "",
		canUndo: false,
		canRedo: false
	}

	/* Initialise new graph with no history */
	initGraph();
	clearHistory();

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
	function initGraph() {
		/* Ensure graph is only initialised once */
		if(("hasBeenInitialised" in graph) && (graph.hasBeenInitialised == true)) {
			return;
		}
		graph.hasBeenInitialised = true;

		graph.on('startTransaction', () => {
			/* Ensure initial state is in history */
			if(history.length === 0) {
				history.push(graph.toJSON());
				revision = history.length - 1;
			}
		});

		graph.on('endTransaction', () => {
			/* handle version history */
			history.length = revision + 1;
			history.push(graph.toJSON());
			if(history.length > 10) {
				history.shift();
			}
			revision = history.length - 1;
			state.canUndo = true;
			state.canRedo = false;

			/* Re-render and dispatch change notification */
			render(false)
			dispatch('graphChange');
		});
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
			enableHotKeys: false,
			onNodeSelection: nodeSelectedCallback,
			onEdgeSelection: ((key, item, toggle) => {}),
		};

		/* If redraw is set to true, clear out and re-render the editor */
		if(redraw === true) {
			if(container != null) {
				ReactDOM.unmountComponentAtNode(container);
			}
		}

		app = ReactDOM.render(TheGraph.App(props), container);
	}

	/*------------------------------------------------------------------------*/

	/* Trigger React update on Svelte change */
	afterUpdate(() => {
		klayjsInit(workerURL);
		initGraph();
		render(false);
	});

	/* Extra render hooks */
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
		if(workerURL === "") {
			return;
		}
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
		initGraph();
	}

	/* Undo last graph change */
	function undo() {
		if(state.canUndo) {
			revision -= 1;
			graph_api.loadJSON(history[revision]).then((g) => {
				graph = g;
				initGraph();
			});
			if(revision == 0) {
				state.canUndo = false;
			}
			state.canRedo = true;
		}
	}

	/* Redo last node change */
	function redo() {
		if(state.canRedo) {
			revision += 1;
			graph_api.loadJSON(history[revision]).then((g) => {
				graph = g;
				initGraph();
			});
			if(revision == history.length - 1) {
				state.canRedo = false;
			}
			state.canUndo = true;
		}
	}

	/* Clear history - advisable if loading completely new graph */
	function clearHistory() {
		history = [];
		revision = 0;
		state.canUndo = false;
		state.canRedo = false;
	}

	/* Expose function API */
	export const API = {
		addComponent,
		removeComponent,
		recentreGraph,
		autolayoutGraph,
		clearGraph,
		undo,
		redo,
		clearHistory
	}
</script>

<div bind:this={container} class:the-graph-dark="{theme === "dark"}"
							class:the-graph-light="{theme === "light"}" />
