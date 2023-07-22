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
    },
    inPorts: {
        data: {
            default: {},
        },
        columns: {
            datatype: 'number',
            default: '80',
        }
    },
    outPorts: {
        data: {
            default: {},
        },
    },
    process: (input, output) => {

    },
};

/*-------------------------------- Exports -----------------------------------*/

export default c;
