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
        colour: '#c4dea2',
    },
    inPorts: {
        in: {},
    },
    process: (input, output) => {
        if (!input.hasData('in')) { return; }
        const msg = input.getData('in');
        console.log(msg);
    },
};

/*-------------------------------- Exports -----------------------------------*/

export default c;
