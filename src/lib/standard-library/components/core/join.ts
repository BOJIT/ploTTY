/**
 * @file join.ts
 * @author James Bennion-Pedley
 * @brief Component to join multiple messages to send them together as a group
 * @date 05/06/2023
 *
 * @copyright Copyright (c) 2023
 *
 */

/*-------------------------------- Imports -----------------------------------*/

import type { PlottyComponent } from "$lib/types/plotty";
import { Link } from "@svicons/ionicons-outline";

/*-------------------------------- Component ---------------------------------*/

const c: PlottyComponent = {
    name: "join",
    category: 'core',
    ui: {
        icon: Link,
    },
    inPorts: {
        in: {},
        condition: {
            default: '\n',
            enumeration: [
                '\n',
                ',',
                ';',
            ]
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
