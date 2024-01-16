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
    waveform: "sine" | "square" | "triangle" | "sawtooth",
    sample_period: number,
    frequency: number,
    phase: number,

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
            let sample: any = 0; // Default is 'counter'

            let t = state.count! * state.sample_period / 1000;

            switch (s.waveform) {
                case "sine":
                    sample = Math.sin(2 * Math.PI * state.frequency * t + state.phase);
                    break;
                case "square":
                    sample = 1;
                    break;
                case "triangle":
                    sample = 1;
                    break;
                case "sawtooth":
                    sample = 1;
                    break;
            };

            output.send({
                out: sample
            });

            if (s.count === undefined)
                s.count = 0;
            s.count++;
        }, state.sample_period, state);
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
        "sample_period": {
            datatype: "number",
            codeDefault: "return 10;",
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
    process: (input, output, context) => {
        const state: ComponentState = context.nodeInstance.state;

        if (input.hasData('waveform'))
            state.waveform = input.getData('waveform');

        if (input.hasData('sample_period'))
            state.sample_period = input.getData('sample_period');

        if (input.hasData('frequency'))
            state.frequency = input.getData('frequency');


        if (input.hasData('frequency'))
            state.phase = input.getData('phase');

        // Any input invalidates the state, causing a counter reload
        launchCounter(state, output);
    },
    init: async (resolve, reject, context) => {
        const state: ComponentState = context.state;

        // Reset internal counter
        state.waveform = "sine";
        state.sample_period = 10;
        state.frequency = 1;
        state.phase = 0;

        state.count = 0;
        state.timer = undefined;

        resolve();
    },
    deinit: async (resolve, reject, context) => {
        const state: ComponentState = context.state;

        // Clear and erase timer
        if (state.timer !== undefined) {
            clearInterval(state.timer);
        }

        resolve();
    },
};

/*-------------------------------- Exports -----------------------------------*/

export default c;
