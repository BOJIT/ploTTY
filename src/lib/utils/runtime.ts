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
import components from "$lib/stores/components";

import { createNetwork, Component, ComponentLoader } from "$lib/middlewares/noflo";
import type { Network } from "$lib/middlewares/noflo/Network";
import type Widgets from "$lib/components/Widgets.svelte";

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
            const c = new Component(component);
            // Assign default error hook
            c.errorHandler = errorHookAPI;
            if (component.widget !== undefined && widgetsAPI !== null)
                // Expose widget methods to component
                c.widget = {
                    post: (m: any): void => {
                        widgetsAPI.post(c.nodeId, m);
                    },
                    get: (): any => {
                        return widgetsAPI.get(c.nodeId);
                    }
                }

            return c;
        });
        return promise;
    }
}

/*--------------------------------- State ------------------------------------*/

const loader = new Loader();

let network: Network | null = null;

let widgetsAPI: Widgets | null = null;
let errorHookAPI: ((e: any) => void) | null = null;

/*------------------------------- Functions ----------------------------------*/

function init(errorHook: (e: any) => void, widgets: Widgets) {
    // Subscribe loader to the component library
    components.subscribe((c) => {
        loader.components = c;
    })

    widgetsAPI = widgets;
    errorHookAPI = errorHook;
}

async function start(g: Graph) {
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
                        if (p[1].codeString === undefined || p[1].codeString === "")
                            break;  // Nothing to send

                        try {
                            const expr = Function(p[1].codeString)();
                            if (expr !== undefined)
                                g.addInitial(expr, n.id, p[0]);
                        } catch (err) {
                            // TODO route this to central exception handler
                            throw new Error(err);
                        }
                        break;
                    }
                }
            });
        }
    })

    // Start network and send IIPs
    network = await createNetwork(g, {
        componentLoader: loader,
    });
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
