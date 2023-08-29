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

/*---------------------------------- Types -----------------------------------*/

import type ProcessOutput from "$lib/middlewares/noflo/ProcessOutput";

type ComponentState = {
    uri: string,
    handle: WebSocket | null,
};

/*-------------------------------- Helpers -----------------------------------*/

function launchWebsocket(state: ComponentState, output: ProcessOutput) {
    if (state.uri === "") return;

    state.handle = new WebSocket(state.uri);
    if (state.handle === null) {
        throw new Error(`Websocket ${state.uri} could not be initialised`);
    }

    state.handle.onmessage = (({ data }) => {
        output.send({
            out: data,
        })
    });

    state.handle.onclose = ((e) => {
        state.handle = null;
        // TODO reopen with poll?
    });

    state.handle.onerror = ((e) => {
        state.handle = null;
        throw new Error(e);
    });
}

function sendToWebsocket(state: ComponentState, message: string) {
    if (state.handle === null) return;

    state.handle.send(message);
}

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
    process: (input, output, context) => {
        if (input.hasData('uri')) {
            context.nodeInstance.state.uri = input.getData('uri');
            launchWebsocket(context.nodeInstance.state, output);
        }

        if (input.hasData('in')) {
            const data = input.getData('in');

            // TODO handle serialisation

            // Send to websocket
            sendToWebsocket(context.nodeInstance.state, data);
        }
    },
    init: async (resolve, reject, context) => {
        context.state.uri = "";
        context.state.handle = null;
        resolve();
    },
    deinit: async (resolve, reject, context) => {
        if (context.state.handle !== null) {
            context.state.handle.close();
        }
        context.state.handle = null;
        resolve();
    },
};

/*-------------------------------- Exports -----------------------------------*/

export default c;
