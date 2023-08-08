/**
 * @file WebRTC.ts
 * @author James Bennion-Pedley
 * @brief Send data via a WebRTC connection. Used to link ploTTY instances
 * @date 05/06/2023
 *
 * @copyright Copyright (c) 2023
 *
 */

/*-------------------------------- Imports -----------------------------------*/

import type { PlottyComponent } from "$lib/types/plotty";
import { Repeat } from "@svicons/ionicons-outline";

/*-------------------------------- Component ---------------------------------*/

const c: PlottyComponent = {
    name: "web-rtc",
    category: 'data',
    ui: {
        icon: Repeat,
    },
    inPorts: {
        in: {},
        stun: {
            default: false,
            enumeration: [
                "stun.l.google.com:19302",
                "stun1.l.google.com:19302",
                "stun2.l.google.com:19302",
                "stun3.l.google.com:19302",
                "stun4.l.google.com:19302",
            ]
        }
    },
    outPorts: {
        out: {},
    },
    process: (input, output) => {

    },
    init: async (resolve, reject, context) => {
        context.state.stun = false;

        resolve();
    },
};

/*-------------------------------- Exports -----------------------------------*/

export default c;
