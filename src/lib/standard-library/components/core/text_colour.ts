/**
 * @file text_colour.ts
 * @author James Bennion-Pedley
 * @brief Wraps string type messages in a VT100-style colour codes for a terminal
 * @date 05/06/2023
 *
 * @copyright Copyright (c) 2023
 *
 */

/*-------------------------------- Imports -----------------------------------*/

import type { PlottyComponent } from "$lib/types/plotty";
import { ColorPalette } from "@svicons/ionicons-outline";

/*---------------------------------- State -----------------------------------*/

const FOREGROUND_CODES = {
    "Black": 30,
    "Red": 31,
    "Green": 32,
    "Yellow": 33,
    "Blue": 34,
    "Magenta": 35,
    "Cyan": 36,
    "White": 37,
    "Default": 38,
};

// Background codes are FG + 10

/*-------------------------------- Component ---------------------------------*/

const c: PlottyComponent = {
    name: "text-colour",
    category: 'core',
    ui: {
        icon: ColorPalette,
    },
    inPorts: {
        in: {},
        colour: {
            enumeration: [
                "Black",
                "Red",
                "Green",
                "Yellow",
                "Blue",
                "Magenta",
                "Cyan",
                "White",
                "Default",
            ]
        },
        mode: {
            enumeration: [
                "foreground",
                "background",
            ]
        }
    },
    outPorts: {
        out: {},
    },
    process: (input, output, context) => {
        if (input.hasData('colour')) {
            context.nodeInstance.state.colour = input.getData('colour');
        }

        if (input.hasData('mode')) {
            context.nodeInstance.state.mode = input.getData('mode');
        }

        if (input.hasData('in')) {
            const data = input.getData('in');
            let code = FOREGROUND_CODES[context.nodeInstance.state.colour];
            if (code === undefined) code = 37;
            if (context.nodeInstance.state.mode === "background") {
                code += 10;
            }

            const coloured = `\x1b[${code}m${data}\x1b[0m`
            output.send({
                out: coloured,
            })
        }
    },
    init: async (resolve, reject, context) => {
        context.state.colour = "default";
        context.state.mode = "foreground";

        resolve();
    },
};

/*-------------------------------- Exports -----------------------------------*/

export default c;
