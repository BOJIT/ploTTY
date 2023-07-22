/**
 * @file console_log.ts
 * @author James Bennion-Pedley
 * @brief Component to log messages to the DeveloperTools console
 * @date 05/06/2023
 *
 * @copyright Copyright (c) 2023
 *
 */

/*-------------------------------- Imports -----------------------------------*/

import type { PlottyComponent } from "$lib/types/plotty";
import { Open } from "@svicons/ionicons-outline";

/*-------------------------------- Component ---------------------------------*/

const c: PlottyComponent = {
    name: "console log",
    category: 'core',
    ui: {
        icon: Open,
        colour: '#FF7777',
    },
    inPorts: {
        in: {
            default: {},
        },
    },
    process: (input, output) => {
        if (!input.hasData('in')) { return; }
        const msg = input.getData('in');
        console.log(msg);
        output.done();
    },
};

/*-------------------------------- Exports -----------------------------------*/

export default c;
