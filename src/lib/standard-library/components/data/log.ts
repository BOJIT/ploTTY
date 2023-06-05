/**
 * @file log.ts
 * @author James Bennion-Pedley
 * @brief Component to log messages to a file
 * @date 05/06/2023
 *
 * @copyright Copyright (c) 2023
 *
 */

/*-------------------------------- Imports -----------------------------------*/

import type { PlottyComponent } from "$lib/types/plotty";
import { DocumentText } from "@svicons/ionicons-outline";

/*-------------------------------- Component ---------------------------------*/

const c: PlottyComponent = {
    name: "log",
    category: 'data',
    ui: {
        icon: DocumentText,
    },
    inputs: {
        data: {},
        newfile: {
            datatype: 'signal'
        },
    },
    process: (input, output) => {

    },
};

/*-------------------------------- Exports -----------------------------------*/

export default c;
