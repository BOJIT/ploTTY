/**
 * @file NoFlo.js
 * @author James Bennion-Pedley
 * @brief Simplified re-write
 * @date 22/07/2023
 *
 * @copyright Copyright (c) 2023
 *
 */

/*---------------------------------- Imports ---------------------------------*/

import type { Graph } from '$lib/middlewares/fbp-graph/Graph';

import { Network } from './Network';
import type { NetworkOptions } from './BaseNetwork';

import { LegacyNetwork } from './LegacyNetwork';

export { isBrowser } from './Platform';
export { ComponentLoader } from './ComponentLoader';
export { Component } from './Component';
export { InPorts, OutPorts } from './Ports';
export { default as InPort } from './InPort';
export { default as OutPort } from './OutPort';

export { asCallback, asPromise } from './AsCallback';
export { asComponent } from './AsComponent';

import * as internalSocket from './InternalSocket';
export { internalSocket };

export { default as IP } from './IP';

/*--------------------------------- Functions --------------------------------*/

export function createNetwork(graphInstance: Graph, options: NetworkOptions): Promise<Network> {
    if (typeof options !== 'object') {
        options = {};
    }

    // Choose legacy or modern network based on whether graph
    // subscription is needed
    const NetworkType = Network;
    const network = new NetworkType(graphInstance, options);

    // Ensure components are loaded before continuing
    const promise = network.loader.listComponents()
        .then(() => {
            if (options.delay) {
                // In case of delayed execution we don't wire it up
                return Promise.resolve(network);
            }
            const connected = /** @type {Promise<Network>} */ (network.connect());
            return connected.then(() => network.start());
        });
    return promise;
}
