/**
 * @file runState.ts
 * @author James Bennion-Pedley
 * @brief Information on current plotter state
 * @date 07/02/2023
 *
 * @copyright Copyright (c) 2023
 *
 */

/*-------------------------------- Imports -----------------------------------*/

import { writable, type Writable } from "svelte/store";
import { type Graph as GraphType } from "$lib/middlewares/fbp-graph/Graph";
import Graph from "$lib/middlewares/fbp-graph";

/*--------------------------------- State ------------------------------------*/

const activeGraph: Writable<GraphType> = writable(new Graph.Graph());
const graphRunning: Writable<boolean> = writable(false);
const nodeSelected: Writable<string> = writable("");

/*------------------------------- Functions ----------------------------------*/

/*-------------------------------- Exports -----------------------------------*/

export {
    activeGraph,
    graphRunning,
    nodeSelected,
}
