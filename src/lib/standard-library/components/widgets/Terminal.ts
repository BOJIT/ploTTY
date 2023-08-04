/**
 * @file Terminal.ts
 * @author James Bennion-Pedley
 * @brief Component to print interactive terminal
 * @date 05/06/2023
 *
 * @copyright Copyright (c) 2023
 *
 */

/*-------------------------------- Imports -----------------------------------*/

import type { PlottyComponent } from "$lib/types/plotty";
import { Terminal as TerminalIcon } from "@svicons/ionicons-outline";

import Terminal from "./Terminal.svelte";

/*-------------------------------- Component ---------------------------------*/

const c: PlottyComponent = {
    name: "terminal",
    category: 'widgets',
    widget: Terminal,
    ui: {
        icon: TerminalIcon,
        colour: '#c0b2d1',
    },
    inPorts: {
        data: {},
        clear: {
            datatype: 'bang',
        }
    },
    outPorts: {
        data: {
            default: {},
        },
    },
    process: (input, output, context) => {
        if (input.hasData('data')) {
            let data = input.getData('data');

            switch (typeof data) {
                case 'string':
                    // No transform needed
                    break;

                case 'number':
                    // Attempt to convert number/array into string representation
                    data = String.fromCharCode(data);
                    break;

                case 'object':
                    // Pretty-print objects as JSON
                    data = JSON.stringify(data, null, 4);
                    break;

                default:
                    data = "Unknown datatype!\n";
                    break;
            }

            context.nodeInstance.widget.post(data);
        }
    },
};

/*-------------------------------- Exports -----------------------------------*/

export default c;
