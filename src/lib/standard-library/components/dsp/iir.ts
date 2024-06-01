/**
 * @file iir.ts
 * @author James Bennion-Pedley
 * @brief IIR Filter (discrete samples)
 * @date 05/06/2023
 *
 * @copyright Copyright (c) 2023
 *
 */

/*-------------------------------- Imports -----------------------------------*/

import type { PlottyComponent } from "$lib/types/plotty";
import { Barcode } from "@svicons/ionicons-outline";

/*-------------------------------- Component ---------------------------------*/

const c: PlottyComponent = {
    name: "IIR-filter",
    category: 'dsp',
    ui: {
        icon: Barcode,
    },
    inPorts: {
        in: {
            datatype: "bang",
        },
        ffCoefficients: {
            datatype: "number",
        },
        fbCoefficients: {
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
        context.state.buffer = [];

        resolve();
    },
};

/*-------------------------------- Exports -----------------------------------*/

export default c;
