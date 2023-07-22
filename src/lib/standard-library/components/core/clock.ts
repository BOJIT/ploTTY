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
            ],
        },
    },
    outPorts: {
        out: {
            datatype: 'bang'
        }
    },
    process: (input, output, context) => {
        console.log(context);
        // if (!c.timer) {
        //     let count = 0;
        //     c.timer = context;
        //     c.timer.interval = setInterval(() => {
        //         let countstring = "test packet: " + count + "\n";
        //         output.send({
        //             out: countstring
        //         });
        //         count++;
        //     }, 1000);
        // }
    },
    deinit: async (context) => {
        console.log("TEARDOWN");
        console.log(callback);
        // if (this.timer) {
        //     cleanup();
        // }
    },
    state: {
        timer: null,
    },
};

/*-------------------------------- Helpers -----------------------------------*/

// Helpers
function cleanup(c) {
    clearInterval(c.timer.interval);
    c.timer.deactivate();
    c.timer = null;
}

/*-------------------------------- Exports -----------------------------------*/

export default c;
