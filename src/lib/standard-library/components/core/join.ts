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

/*---------------------------------- State -----------------------------------*/

const SPECIAL_CHARS = {
    "newline": "\n",
    "space": "",
    "null-terminator": "\0",
    "tab": "\t",
};

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
                'newline',
                'space',
                'null-terminator',
                'tab',
                ',',
                ';',
            ]
        },
        datatype: {
            enumeration: [
                'string',
                'number',
                'object',
            ]
        }
    },
    outPorts: {
        out: {},
    },
    process: (input, output, context) => {
        if (input.hasData('condition')) {
            let cond = input.getData('condition');

            // Special keywords (from enumeration)
            if (typeof cond === "string" && cond in SPECIAL_CHARS)
                cond = SPECIAL_CHARS[cond];

            // Convert single char to number
            if (typeof cond === "string" && cond.length === 1)
                cond = cond.charCodeAt(0);

            context.nodeInstance.state.condition = cond;
        }

        if (input.hasData('datatype')) {
            context.nodeInstance.state.datatype = input.getData('datatype');
        }

        if (input.hasData('in')) {
            let data = input.getData('in');

            if (context.nodeInstance.state.condition === null) {
                output.send({
                    out: data
                });
            } else {
                context.nodeInstance.state.buffer.push(data);
            }

            if (data === context.nodeInstance.state.condition) {
                let flushOutput = context.nodeInstance.state.buffer;

                // If output type is string and inputs are numbers, do an ASCII conversion
                if (context.nodeInstance.state.datatype === "string") {
                    flushOutput = String.fromCharCode.apply(null, context.nodeInstance.state.buffer);
                }

                output.send({
                    // Pass by REFERENCE, not COPY
                    out: flushOutput,
                });
                context.nodeInstance.state.buffer = [];
            }
        }
    },
    init: async (resolve, reject, context) => {
        context.state.buffer = [];
        context.state.condition = null;
        context.state.datatype = "number";

        resolve();
    },
};

/*-------------------------------- Exports -----------------------------------*/

export default c;
