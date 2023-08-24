/**
 * @file serial_in.ts
 * @author James Bennion-Pedley
 * @brief Component to get input from a serial port
 * @date 05/06/2023
 *
 * @copyright Copyright (c) 2023
 *
 */

/*-------------------------------- Imports -----------------------------------*/

import type { PlottyComponent } from "$lib/types/plotty";
import { LogIn } from "@svicons/ionicons-outline";

import { get } from "svelte/store";
import hardware from "$lib/stores/hardware";

/*---------------------------------- Types -----------------------------------*/

import type ProcessOutput from "$lib/middlewares/noflo/ProcessOutput";

type ComponentState = {
    enable: boolean,
    port?: string,
    baud?: number,

    portList?: SerialPort[],        // Await cannot be called after initialisation
    openInitiated?: boolean,        // Used to stop multiple async functions firing
    closeInitiated?: boolean,       // Used to stop multiple async functions firing
    portHandle?: SerialPort,        // Runtime handle pointing to the Serial object
    portReadable?: ReadableStreamDefaultReader<Uint8Array>,
};

/*-------------------------------- Helpers -----------------------------------*/

async function closeSerial(state: ComponentState) {
    if (state.portHandle !== undefined && !(state.closeInitiated)) {
        state.closeInitiated = true;

        await state.portReadable?.cancel();

        try {
            if (state.portReadable?.closed) {
                await state.portHandle.close();
            }
        } catch (e) {
            if (e instanceof DOMException) {
                // Port has already been closed
            } else {
                throw e;
            }
        }
        state.closeInitiated = false;
        state.portHandle = undefined;
        state.portReadable = undefined;
    }
}

async function launchSerial(state: ComponentState, output: ProcessOutput) {
    // Close existing serial connection if it exists
    closeSerial(state);

    if (state.enable === false)
        return;

    if (state.baud === undefined)
        return;

    if (state.portList === undefined)
        return;

    let targetPort: SerialPort | undefined = undefined;
    state.portList.forEach((p) => {
        let info = p.getInfo();
        const key = hardware.infoToKey(info);
        const hw_store = get(hardware);
        if (key in hw_store) {
            // TODO eventually get ID via user label
            if (key === state.port)
                targetPort = p;
        }
    })

    // Initiate open() call
    if (!(state.openInitiated)) {
        state.openInitiated = true;
        try {
            await targetPort?.open({ baudRate: state.baud });
        } catch (e) {
            if (e instanceof DOMException) {
                // Port is already open...
                // Wait for OS call to finish (or readable will be null)
                await new Promise(resolve => setTimeout(resolve, 200));
            } else {
                throw e;
            }
        }

        // Initialise reader
        state.openInitiated = false;
        state.portHandle = targetPort;
        state.portReadable = targetPort?.readable?.getReader();

        try {
            while (true) {
                const { value, done } = await state.portReadable?.read();
                if (done) {
                    break;
                }
                value.forEach((v: number) => {
                    output.send({
                        out: v
                    });
                })
            }
        } catch (e) {
            throw new Error(e);
        }
    }
}

/*-------------------------------- Component ---------------------------------*/

const c: PlottyComponent = {
    name: "serial in",
    category: 'data',
    ui: {
        icon: LogIn,
    },
    inPorts: {
        enable: {
            datatype: 'boolean',
            default: true,
            enumeration: [
                true,
                false
            ]
        },
        port: {
            datatype: 'string',
            default: 'none',
            enumeration: async () => {
                if (!("serial" in navigator))
                    return [];

                const keys: string[] = [];
                const ports = await navigator.serial.getPorts();
                ports.forEach((p) => {
                    let info = p.getInfo();
                    const key = hardware.infoToKey(info);
                    const hw_store = get(hardware);
                    if (key in hw_store)
                        keys.push(key);
                })

                return keys;
            }
        },
        baud: {
            datatype: 'number',
            default: 115200,
            enumeration: [
                1200,
                2400,
                4800,
                9600,
                19200,
                38400,
                57600,
                115200
            ]
        }
    },
    outPorts: {
        out: {
            datatype: 'string',
        }
    },
    process: (input, output, context) => {
        if (input.hasData('enable')) {
            context.nodeInstance.state.enable = input.getData('enable');
        }

        if (input.hasData('port')) {
            context.nodeInstance.state.port = input.getData('port');
        }

        if (input.hasData('baud')) {
            context.nodeInstance.state.baud = input.getData('baud');
        }

        launchSerial(context.nodeInstance.state, output);
    },
    init: async (resolve, reject, context) => {
        if (!("serial" in navigator))
            reject("This browser does not support the WebSerial API!");

        context.state.enable = false;
        context.state.port = undefined;
        context.state.baud = undefined;
        context.state.portList = await navigator.serial.getPorts();
        context.state.openInitiated = false;

        resolve();
    },
    deinit: async (resolve, reject, context) => {
        await closeSerial(context.state);
    },
};

/*-------------------------------- Exports -----------------------------------*/

export default c;
