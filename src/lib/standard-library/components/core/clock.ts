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
                "signal",
                "timestamp",
                "unix",
                "counter",
            ],
        },
    },
    outPorts: {
        out: {
            datatype: 'bang'
        }
    },
    process: (input, output, context) => {
        let state = context.nodeInstance.state;
        if (state.timer === undefined) {
            state.timer = setInterval((s) => {
                let countstring = `count ${s.count}`;
                output.send({
                    out: countstring
                });
                s.count++;
            }, 100, state);
        }
    },
    init: async (resolve, reject, context) => {
        // Reset internal counter
        context.state.count = 0;
        context.state.timer = undefined;

        resolve();
    },
    deinit: async (resolve, reject, context) => {
        // Clear and erase timer
        if (context.state.timer !== undefined) {
            clearInterval(context.state.timer);
            context.state.timer = undefined;
        }
        context.state.count = 0;

        resolve();
    },
};

/*-------------------------------- Exports -----------------------------------*/

export default c;
