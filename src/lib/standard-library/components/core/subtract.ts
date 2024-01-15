/**
 * @file subtract.ts
 * @author James Bennion-Pedley
 * @brief Subtract B from A
 * @date 05/06/2023
 *
 * @copyright Copyright (c) 2023
 *
 */

/*-------------------------------- Imports -----------------------------------*/

import type { PlottyComponent } from "$lib/types/plotty";
import { Remove } from "@svicons/ionicons-outline";

/*-------------------------------- Component ---------------------------------*/

const c: PlottyComponent = {
    name: "subtract",
    category: 'core',
    ui: {
        icon: Remove,
    },
    inPorts: {
        a: {
            datatype: "number",
        },
        b: {
            datatype: "number",
        },
    },
    outPorts: {
        out: {},
    },
    process: (input, output) => {
        // TODO add implementation
    },
    init: async (resolve, reject, context) => {
        resolve();
    },
};

/*-------------------------------- Exports -----------------------------------*/

export default c;
