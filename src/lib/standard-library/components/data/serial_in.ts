/**
 * @file serial_in.ts
 * @author James Bennion-Pedley
 * @brief Component to get input from a serial port
 * @date 05/06/2023
 *
 * @copyright Copyright (c) 2023
 *
 */

/*-------------------------------- Imports -----------------------------------*/

import type { PlottyComponent } from "$lib/types/plotty";
import { Terminal } from "@svicons/ionicons-outline";

/*-------------------------------- Component ---------------------------------*/

const c: PlottyComponent = {
    name: "serial in",
    category: 'data',
    ui: {
        icon: Terminal,
    },
    inputs: {
        enable: {
            datatype: 'boolean',
            default: true,
            enumeration: [
                true,
                false
            ]
        },
        port: {
            datatype: 'string',
            default: 'none',
            enumeration: [
                'COM1',
                'COM2',
            ]
        },
        baud: {
            datatype: 'number',
            default: 115200,
            enumeration: [
                1200,
                2400,
                4800,
                9600,
                19200,
                38400,
                57600,
                115200
            ]
        }
    },
    outputs: {
        out: {
            datatype: 'string',
        }
    },
    process: (input, output) => {

    },
};

/*-------------------------------- Exports -----------------------------------*/

export default c;
