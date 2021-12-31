<script>
	import { afterUpdate, onDestroy } from 'svelte';

	/* NoFlo Imports */
	import ReactDOM from 'react-dom';
	import TheGraph from 'the-graph';
	import { Graph } from 'fbp-graph';

	import 'klayjs/klay.js';

	/* Auto Layout Engine */
	// import { KlayNoflo } from 'klayjs-noflo/klay-noflo.js';

	// console.log(KlayNoflo);

	function klayjsCallback(keilerGraph) {
		console.log(keilerGraph);
	}

	function cleanArray(array) {
	for (var i = 0; i < array.length; i++) {
			if (array[i] === null || array[i] === undefined) {
				array.splice(i, 1);
				i--;
			}
		}
		return array;
	};

	function klayjsFormat(graph, portInfo, direction) {
		// Default direction is left to right
		direction = direction || 'RIGHT';
		var portConstraints = 'FIXED_POS';
		// Default port and node properties
		var portProperties = {
			inportSide: 'WEST',
			outportSide: 'EAST',
			width: 10,
			height: 10
		};
		if (direction === 'DOWN') {
			portProperties.inportSide = 'NORTH';
			portProperties.outportSide = 'SOUTH';
		}
		var nodeProperties = {
			width: 72,
			height: 72
		};
		// Start KGraph building
		var kGraph = {
			id: graph.name,
			children: [], 
			edges: []
		};
		// Encode nodes
		var nodes = graph.nodes;
		var idx = {};
		var countIdx = 0;
		var nodeChildren = nodes.map(function (node) {
			var inPorts = portInfo[node.id].inports;
			var inPortsKeys = Object.keys(inPorts);
			var inPortsTemp = inPortsKeys.map(function (key) {
			return {
				id: node.id + '_' + key,
				width: portProperties.width,
				height: portProperties.height,
				x: portInfo[node.id].inports[key].x - portProperties.width,
				y: portInfo[node.id].inports[key].y
			};
			});
			var outPorts = portInfo[node.id].outports;
			var outPortsKeys = Object.keys(outPorts);
			var outPortsTemp = outPortsKeys.map(function (key) {
			return {
				id: node.id + '_' + key,
				width: portProperties.width,
				height: portProperties.height,
				x: portInfo[node.id].outports[key].x,
				y: portInfo[node.id].outports[key].y
			};
			});

			var kChild = {
			id: node.id,
			labels: [{text: node.metadata.label}],
			width: nodeProperties.width,
			height: nodeProperties.height,
			ports: inPortsTemp.concat(outPortsTemp),
			properties: {
				'portConstraints': portConstraints
			}
			};
			idx[node.id] = countIdx++;
			return kChild;
		});

		// Graph i/o to kGraph nodes
		var inports = graph.inports;
		var inportsKeys = Object.keys(inports);
		var inportChildren = inportsKeys.map(function(key){
			var inport = inports[key];
			var tempId = "inport:::"+key;
			// Inports just has only one output port
			var uniquePort = {
			id: inport.port,
			width: portProperties.width,
			height: portProperties.height,
			properties: {
				'de.cau.cs.kieler.portSide': portProperties.outportSide
			}
			};
			
			var kChild = {
			id: tempId, 
			labels: [{text: key}],
			width: nodeProperties.width, 
			height: nodeProperties.height,
			ports: [uniquePort],
			properties: {
				'portConstraints': portConstraints,
				"de.cau.cs.kieler.klay.layered.layerConstraint": "FIRST_SEPARATE"
			}
			};
			idx[tempId] = countIdx++;
			return kChild;
		});
		var outports = graph.outports;
		var outportsKeys = Object.keys(outports);
		var outportChildren = outportsKeys.map(function(key){
			var outport = outports[key];
			var tempId = "outport:::"+key;
			// Outports just has only one input port
			var uniquePort = {
			id: outport.port,
			width: portProperties.width,
			height: portProperties.height,
			properties: {
				'de.cau.cs.kieler.portSide': portProperties.inportSide
			}
			};

			var kChild = {
			id: tempId, 
			labels: [{text: key}],
			width: nodeProperties.width, 
			height: nodeProperties.height,
			ports: [uniquePort],
			properties: {
				'portConstraints': portConstraints,
				"de.cau.cs.kieler.klay.layered.layerConstraint": "LAST_SEPARATE"
			}
			};
			idx[tempId] = countIdx++;
			return kChild;
		});

		// Combine nodes, inports, outports to one array
		kGraph.children = nodeChildren.concat(inportChildren, outportChildren);

		// Encode edges (together with ports on both edges and already
		// encoded nodes)
		var currentEdge = 0;
		var edges = graph.edges;
		edges.map(function (edge) {
			if (edge.data !== undefined) {
			return;
			}
			var source = edge.from.node;
			var sourcePort = edge.from.port;
			var target = edge.to.node;
			var targetPort = edge.to.port;
			kGraph.edges.push({
			id: 'e' + currentEdge++, 
			source: source,
			sourcePort: source + '_' + sourcePort,
			target: target,
			targetPort: target + '_' + targetPort
			});
		});
		
		// Graph i/o to kGraph edges
		var inportEdges = inportsKeys.map(function (key) {
			var inport = inports[key];
			var source = "inport:::"+key;
			var sourcePort = key;
			var target = inport.process;
			var targetPort = inport.port;
			var inportEdge = {
			id: 'e' + currentEdge++,
			source: source,
			sourcePort: source + '_' + sourcePort,
			target: target,
			targetPort: target + '_' + targetPort
			};
			return inportEdge;
		});
		var outportEdges = outportsKeys.map(function (key) {
			var outport = outports[key];
			var source = outport.process;
			var sourcePort = outport.port;
			var target = "outport:::"+key;
			var targetPort = key;
			var outportEdge = {
			id: 'e' + currentEdge++,
			source: source,
			sourcePort: source + '_' + sourcePort,
			target: target,
			targetPort: target + '_' + targetPort
			};
			return outportEdge;
		});

		// Combine edges, inports, outports to one array
		kGraph.edges = kGraph.edges.concat(inportEdges, outportEdges);
		
		// Encode groups
		var groups = graph.groups;
		var countGroups = 0;
		// Mark the nodes already in groups to avoid the same node in many groups
		var nodesInGroups = [];
		groups.map(function (group) {
			// Create a node to use as a subgraph
			var node = {
			id: 'group' + countGroups++, 
			children: [], 
			edges: []
			};
			// Build the node/subgraph
			group.nodes.map(function (n) {
			var nodeT = kGraph.children[idx[n]];
			if (nodeT === null) {
				return;
			}
			if (nodesInGroups.indexOf(nodeT) >= 0) {
				return;
			}
			nodesInGroups.push(nodeT);
			node.children.push(nodeT);
			node.edges.push(kGraph.edges.filter(function (edge) {
				if (edge) {
				if ((edge.source === n) || (edge.target === n)) {
					return edge;
				}
				}
			})[0]);
			node.edges = cleanArray(node.edges);

			// Mark nodes inside the group to be removed from the graph
			kGraph.children[idx[n]] = null;

			});
			// Mark edges too
			node.edges.map(function (edge) {
			if (edge) {
				kGraph.edges[parseInt(edge.id.substr(1), 10)] = null;
			}
			});
			// Add node/subgraph to the graph
			kGraph.children.push(node);
		});

		// Remove the nodes and edges from the graph, just preserve them
		// inside the subgraph/group
		kGraph.children = cleanArray(kGraph.children);
		kGraph.edges = cleanArray(kGraph.edges);

		return kGraph;
	}

	const worker = new Worker('worker/klay.js');
	worker.addEventListener('message', function (e) {
		klayjsCallback(e.data);
	}, false);

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

		console.log(app.refs.graph);
		console.log(graph);

		let kGraph = klayjsFormat(graph, portInfo, 'RIGHT');

		kGraph.id = "Current";
		console.log(kGraph);
		console.log(options);

		worker.postMessage({
			"graph": kGraph,
			"options": options
		});
	}

	/* Clear whole graph */
	function clearGraph() {
		graph = new Graph();
	}

	/* Expose function API */
	export const API = {
		addComponent,
		removeComponent,
		recentreGraph,
		autolayoutGraph,
		clearGraph
	}
</script>

<div bind:this={container} class:the-graph-dark="{theme === "dark"}"
							class:the-graph-light="{theme === "light"}" />