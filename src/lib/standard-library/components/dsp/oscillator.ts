/**
 * @file oscillator.ts
 * @author James Bennion-Pedley
 * @brief Simple block to generate arbitrary waveforms
 * @date 05/06/2023
 *
 * @copyright Copyright (c) 2023
 *
 */

/*-------------------------------- Imports -----------------------------------*/

import type { PlottyComponent } from "$lib/types/plotty";
import type ProcessOutput from "$lib/middlewares/noflo/ProcessOutput";
import { Pulse } from "@svicons/ionicons-outline";

/*---------------------------------- Types -----------------------------------*/


type ComponentState = {
    period: number,
    datatype: "counter" | "iso-timestamp" | "signal" | "timestamp" | "unix",
    count?: number,
    timer?: any,
};


/*-------------------------------- Helpers -----------------------------------*/

function launchCounter(state: ComponentState, output: ProcessOutput) {
    // Clear and erase existing timer
    if (state.timer !== undefined) {
        clearInterval(state.timer);
        state.timer = undefined;
    }
    state.count = 0;

    // Create new timer
    if (state.timer === undefined) {
        state.timer = setInterval((s) => {
            let timeMessage: any = s.count; // Default is 'counter'
            switch (s.datatype) {
                case "signal":
                    timeMessage = true; // TODO see how noflo can send a signal
                    break;
                case "iso-timestamp":
                    timeMessage = new Date().toISOString();
                    break;
                case "timestamp":
                    timeMessage = new Date().toLocaleString();
                    break;
                case "unix":
                    timeMessage = Date.now() / 1000;
                    break;
            };

            output.send({
                out: timeMessage
            });

            if (s.count === undefined)
                s.count = 0;
            s.count++;
        }, state.period, state);
    }
}

/*-------------------------------- Component ---------------------------------*/

const c: PlottyComponent = {
    name: "oscillator",
    category: 'dsp',
    ui: {
        icon: Pulse,
    },
    inPorts: {
        waveform: {
            enumeration: [
                "sine",
                "square",
                "triangle",
                "sawtooth",
            ]
        },
        samplePeriod: {
            datatype: "number",
            codeDefault: "return 1;",
        },
        frequency: {
            datatype: "number",
            codeDefault: "return 1;",
        },
        phase: {
            datatype: "number",
        }
    },
    outPorts: {
        out: {},
    },
    process: (input, output) => {
        // TODO add implementation
    },
    init: async (resolve, reject, context) => {
        // Reset internal counter
        context.state.period = 1000;
        context.state.datatype = 'counter';
        context.state.count = 0;
        context.state.timer = undefined;

        resolve();
    },
};

/*-------------------------------- Exports -----------------------------------*/

export default c;
