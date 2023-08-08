/**
 * @file websocket.ts
 * @author James Bennion-Pedley
 * @brief Send/Receive data from a WebSocket.
 * @date 05/06/2023
 *
 * @copyright Copyright (c) 2023
 *
 */

/*-------------------------------- Imports -----------------------------------*/

import type { PlottyComponent } from "$lib/types/plotty";
import { Globe } from "@svicons/ionicons-outline";

/*-------------------------------- Component ---------------------------------*/

const c: PlottyComponent = {
    name: "websocket",
    category: 'data',
    ui: {
        icon: Globe,
    },
    inPorts: {
        in: {},
        uri: {},
    },
    outPorts: {
        out: {},
    },
    process: (input, output) => {

    },
    init: async (resolve, reject, context) => {
        context.state.uri = "";

        resolve();
    },
};

/*-------------------------------- Exports -----------------------------------*/

export default c;
