/**
 * @file runtime.ts
 * @author James Bennion-Pedley
 * @brief Core 'noflo' graph launching/editing logic
 * @date 18/07/2023
 *
 * @copyright Copyright (c) 2023
 *
 */

/*-------------------------------- Imports -----------------------------------*/

import type { Graph } from "$lib/middlewares/fbp-graph/Graph";
import components, { type ComponentLibrary } from "$lib/stores/components";

import { createNetwork, Component, ComponentLoader } from "$lib/middlewares/noflo";
import type { Network } from "$lib/middlewares/noflo/Network";

/*--------------------------------- Types ------------------------------------*/

class Loader extends ComponentLoader {
    constructor() {
        super('/', {}); // call the super class constructor

        /* loader by default is empty */
        this.components = {};
        this.ready = true;
    }

    load(name: string) {
        console.log("huh");

        const promise = new Promise((resolve, reject) => {
            if (!this.components) {
                reject(new Error(`Component tree not initialised!`));
                return;
            }

            let component = this.components[name];

            if (!component) {
                // Failure to load
                reject(new Error(`Component ${name} not available!`));
                return;
            }
            resolve(component);
        }).then((component: any) => {
            let instance = component.getComponent(Component);
            return instance;
        });
        return promise;
    }
}

/*--------------------------------- State ------------------------------------*/

const loader = new Loader();

let network: Network;

/*------------------------------- Functions ----------------------------------*/

function init(errorHook: (e: any) => {}) {
    // Subscribe loader to the component library
    components.subscribe((c) => {
        loader.components = c;
    })

    // Create initial (empty) network
}

async function start(g: Graph, l: ComponentLibrary) {
    network = await createNetwork(g, {
        componentLoader: loader,
    });

    // network.sendInitials();

    console.log(network);
}

function stop() {
    // network.sendInitials
}

/*-------------------------------- Exports -----------------------------------*/

export default {
    init,
    start,
    stop,
};