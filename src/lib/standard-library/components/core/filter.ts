/**
 * @file filter.ts
 * @author James Bennion-Pedley
 * @brief Component to selectively forward messages based on a filter expression
 * @date 05/06/2023
 *
 * @copyright Copyright (c) 2023
 *
 */

/*-------------------------------- Imports -----------------------------------*/

import type { PlottyComponent } from "$lib/types/plotty";
import { Funnel } from "@svicons/ionicons-outline";

/*-------------------------------- Component ---------------------------------*/

const c: PlottyComponent = {
    name: "filter",
    category: 'core',
    ui: {
        icon: Funnel,
    },
    inPorts: {
        data: {
            default: {},
        },
        expression: {
            default: {},
        }
    },
    outPorts: {
        out: {},
    },
    process: (input, output) => {

    },
};

/*-------------------------------- Exports -----------------------------------*/

export default c;
