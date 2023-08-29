/**
 * @file clock.ts
 * @author James Bennion-Pedley
 * @brief Component to generate periodic events
 * @date 05/06/2023
 *
 * @copyright Copyright (c) 2023
 *
 */

/*-------------------------------- Imports -----------------------------------*/

import type { PlottyComponent } from "$lib/types/plotty";
import { Alarm } from "@svicons/ionicons-outline";

/*---------------------------------- Types -----------------------------------*/

import type ProcessOutput from "$lib/middlewares/noflo/ProcessOutput";

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
    name: "clock",
    category: 'core',
    ui: {
        icon: Alarm,
    },
    inPorts: {
        period: {
            default: 1000,
        },
        datatype: {
            datatype: 'string',
            enumeration: [
                "counter",
                "iso-timestamp",
                "signal",
                "timestamp",
                "unix",
                "utc",
            ],
        },
    },
    outPorts: {
        out: {
            datatype: 'bang'
        }
    },
    process: (input, output, context) => {
        if (input.hasData('period')) {
            context.nodeInstance.state.period = input.getData('period');
        }

        if (input.hasData('datatype')) {
            context.nodeInstance.state.datatype = input.getData('datatype');
        }

        launchCounter(context.nodeInstance.state, output);
    },
    init: async (resolve, reject, context) => {
        // Reset internal counter
        context.state.period = 1000;
        context.state.datatype = 'counter';
        context.state.count = 0;
        context.state.timer = undefined;

        resolve();
    },
    deinit: async (resolve, reject, context) => {
        // Clear and erase timer
        if (context.state.timer !== undefined) {
            clearInterval(context.state.timer);
        }

        resolve();
    },
};

/*-------------------------------- Exports -----------------------------------*/

export default c;
