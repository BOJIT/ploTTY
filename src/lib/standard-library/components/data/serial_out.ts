/**
 * @file serial_out.ts
 * @author James Bennion-Pedley
 * @brief Component to send output to a serial port
 * @date 05/06/2023
 *
 * @copyright Copyright (c) 2023
 *
 */

/*-------------------------------- Imports -----------------------------------*/

import type { PlottyComponent } from "$lib/types/plotty";
import { LogOut } from "@svicons/ionicons-outline";

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
    portWritable?: WritableStreamDefaultWriter<Uint8Array>,
    encoder?: TextEncoder,
};

/*-------------------------------- Helpers -----------------------------------*/

async function closeSerial(state: ComponentState) {
    if (state.portHandle !== undefined && !(state.closeInitiated)) {
        state.closeInitiated = true;

        state.portWritable?.releaseLock();

        try {
            // This ensures that a corresponding readable closes first
            await new Promise(resolve => setTimeout(resolve, 200));
            await state.portHandle.close();
        } catch (e) {
            if (e instanceof DOMException) {
                // Port has already been closed
            } else {
                throw e;
            }
        }
        state.closeInitiated = false;
        state.portHandle = undefined;
        state.portWritable = undefined;
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

    // Initiate open() call [messy logic to handle async code]
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

        // Initialise writer
        state.openInitiated = false;
        state.portHandle = targetPort;
        state.portWritable = targetPort?.writable?.getWriter();
    }
}

/*-------------------------------- Component ---------------------------------*/

const c: PlottyComponent = {
    name: "serial out",
    category: 'data',
    ui: {
        icon: LogOut,
    },
    inPorts: {
        input: {},
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
    process: (input, output, context) => {
        if (input.hasData('input')) {
            // Write to output writable
            let data = input.getData('input');


            if (!context.nodeInstance.state.portWritable)
                return; // Port invalid...

            switch (typeof data) {
                case 'string':
                    // Encode strings as UTF-8
                    data = context.nodeInstance.state.encoder.encode(data);
                    break;

                case 'number':
                    // Send as a raw byte (val % 256)
                    data = new Uint8Array([data % 256]);
                    break;

                case 'object':
                    // Convert objects as JSON (not pretty-printed)
                    data = JSON.stringify(data).concat("\n");
                    data = context.nodeInstance.state.encoder.encode(data);
                    break;

                default:
                    console.warn("Unknown Serial Datatype: ignoring...");
                    break;
            }

            // Send data to stream (NOTE we don't await!!!)
            context.nodeInstance.state.portWritable.write(data);
        }

        if (input.hasData('port') || input.hasData('baud')) {
            if (input.hasData('port')) {
                context.nodeInstance.state.port = input.getData('port');
            }
            if (input.hasData('baud')) {
                context.nodeInstance.state.baud = input.getData('baud');
            }

            launchSerial(context.nodeInstance.state, output);
        }
    },
    init: async (resolve, reject, context) => {
        if (!("serial" in navigator))
            reject("This browser does not support the WebSerial API!");

        context.state.port = undefined;
        context.state.baud = undefined;
        context.state.portList = await navigator.serial.getPorts();
        context.state.openInitiated = false;
        context.state.encoder = new TextEncoder();

        resolve();
    },
    deinit: async (resolve, reject, context) => {
        await closeSerial(context.state);
    },
};

/*-------------------------------- Exports -----------------------------------*/

export default c;
