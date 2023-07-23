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

    async listComponents(callback?: any): Promise<{ [x: string]: any; }> {
        if (this.components === null)
            return {};

        return this.components;
    }

    load(name: string) {
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
            return new Component(component);
        });
        return promise;
    }
}

/*--------------------------------- State ------------------------------------*/

const loader = new Loader();

let network: Network | null = null;

/*------------------------------- Functions ----------------------------------*/

function init(errorHook: (e: any) => void) {
    // Subscribe loader to the component library
    components.subscribe((c) => {
        loader.components = c;
    })

    // Create initial (empty) network
}

async function start(g: Graph) {
    network = await createNetwork(g, {
        componentLoader: loader,
    });

    // Iterate through nodes to collect IIP config
    g.nodes.forEach((n) => {
        if ("portConfig" in n.metadata) {
            Object.entries(n.metadata.portConfig).forEach((p) => {
                // remove existing initials
                g.removeInitial(n.id, p[0]);

                // Add relevant IIP
                switch (p[1].mode) {
                    case "enum": {
                        if (p[1].chosenEnumeration !== undefined)
                            g.addInitial(p[1].chosenEnumeration, n.id, p[0]);
                        break;
                    }
                    case "custom": {

                        break;
                    }
                }
            });
        }
    })

    network.sendInitials();

    // TODO find way to update initials on <ComponentSettings/> change

    console.log(network);
}

async function stop() {
    if (network !== null) {
        await network.stop();
        network = null;
    }
}

/*-------------------------------- Exports -----------------------------------*/

export default {
    init,
    start,
    stop,
};
