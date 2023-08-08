/**
 * @file function.ts
 * @author James Bennion-Pedley
 * @brief Component to transform a function based on an input expression
 * @date 05/06/2023
 *
 * @copyright Copyright (c) 2023
 *
 */

/*-------------------------------- Imports -----------------------------------*/

import type { PlottyComponent } from "$lib/types/plotty";
import { GitCompare } from "@svicons/ionicons-outline";

/*-------------------------------- Component ---------------------------------*/

const c: PlottyComponent = {
    name: "function",
    category: 'core',
    ui: {
        icon: GitCompare,
    },
    inPorts: {
        in: {},
        function: {
            codeDefault: "return (input) => {\n    return input;\n}"
        }
    },
    outPorts: {
        out: {},
    },
    process: (input, output, context) => {
        if (input.hasData('function')) {
            context.nodeInstance.state.func = input.getData('function');
        }

        if (input.hasData('in')) {
            const d = input.getData('in');
            const ret = context.nodeInstance.state.func(d);
            if (typeof ret !== "undefined") {
                output.send({
                    out: ret,
                });
            }
        }
    },
    init: async (resolve, reject, context) => {
        // Default function is just a passthrough
        context.state.func = (i: any) => { return i };

        resolve();
    },
};

/*-------------------------------- Exports -----------------------------------*/

export default c;
