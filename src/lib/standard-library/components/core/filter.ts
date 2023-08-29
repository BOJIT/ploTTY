/**
 * @file filter.ts
 * @author James Bennion-Pedley
 * @brief Component to selectively forward messages based on a filter expression
 * @date 05/06/2023
 *
 * @copyright Copyright (c) 2023
 *
 */

/*-------------------------------- Imports -----------------------------------*/

import type { PlottyComponent } from "$lib/types/plotty";
import { Funnel } from "@svicons/ionicons-outline";

/*-------------------------------- Component ---------------------------------*/

const c: PlottyComponent = {
    name: "filter",
    category: 'core',
    ui: {
        icon: Funnel,
    },
    inPorts: {
        in: {},
        expression: {
            codeDefault: "return (i) => i > 1 ? true : false",
        }
    },
    outPorts: {
        out: {},
    },
    process: (input, output, context) => {
        if (input.hasData('expression')) {
            context.nodeInstance.state.func = input.getData('expression');
        }

        if (input.hasData('in')) {
            const d = input.getData('in');
            const ret = context.nodeInstance.state.func(d);
            if (ret) {
                output.send({
                    out: d,
                });
            }
        }
    },
    init: async (resolve, reject, context) => {
        // Default expression lets all through
        context.state.func = (i: any) => { return true };

        resolve();
    },
};

/*-------------------------------- Exports -----------------------------------*/

export default c;
