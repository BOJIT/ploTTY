/**
 * @file random.ts
 * @author James Bennion-Pedley
 * @brief Component to generate random outputs
 * @date 05/06/2023
 *
 * @copyright Copyright (c) 2023
 *
 */

/*-------------------------------- Imports -----------------------------------*/

import type { PlottyComponent } from "$lib/types/plotty";
import { Help } from "@svicons/ionicons-outline";

/*-------------------------------- Component ---------------------------------*/

const c: PlottyComponent = {
    name: "random",
    category: 'core',
    ui: {
        icon: Help,
    },
    inPorts: {
        type: {},
        dimension: {
            datatype: "number"
        }
    },
    outPorts: {
        out: {},
    },
    process: (input, output) => {

    },
    init: async (resolve, reject, context) => {
        context.state.buffer = [];

        resolve();
    },
};

/*-------------------------------- Exports -----------------------------------*/

export default c;
