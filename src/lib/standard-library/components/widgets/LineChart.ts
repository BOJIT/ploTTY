/**
 * @file LineChart.ts
 * @author James Bennion-Pedley
 * @brief Component to plot 2d line charts (WebGL accelerated)
 * @date 05/06/2023
 *
 * @copyright Copyright (c) 2023
 *
 */

/*-------------------------------- Imports -----------------------------------*/

import type { PlottyComponent } from "$lib/types/plotty";
import { Analytics } from "@svicons/ionicons-outline";

import { get } from "svelte/store";

import settings from "$lib/stores/settings";
import LineChart from "./LineChart.svelte";

/*-------------------------------- Component ---------------------------------*/

const c: PlottyComponent = {
    name: "line chart",
    category: 'widgets',
    widget: LineChart,
    ui: {
        icon: Analytics,
        colour: '#c0b2d1',
    },
    inPorts: {
        data: {
            default: {},
        },
        limits: {
            codeDefault: "return {\n    x: 100,\n    y: [-1, 1],\n};"
        },
        labels: {
            codeDefault: "return [\n    'Label 1',\n    'Label 2',\n];"
        },
        clear: {
            datatype: 'boolean',
            enumeration: [
                true,
                false,
            ],
        },
    },
    process: (input, output, context) => {
        if (input.hasData('data')) {
            let data = input.getData('data');
            if (data.length === undefined) {
                data = [data]; // Implicit array cast for 1D data
            }

            context.nodeInstance.widget?.post(data);
        }

        if (input.hasData('limits')) {
            let data = input.getData('limits');   // Any datatype will trigger a clear
            context.nodeInstance.widget?.post({
                "command": "limits",
                "data": data,
            });
        }

        if (input.hasData('labels')) {
            let data = input.getData('labels');
            context.nodeInstance.widget?.post({
                "command": "labels",
                "data": data,
            });
        }

        if (input.hasData('clear')) {
            let data = input.getData('clear');   // Any datatype will trigger a clear
            if (data) {
                context.nodeInstance.widget?.post({
                    "command": "clear",
                });
            }
        }
    },
    init: async (resolve, reject, context) => {
        // Global clear of widgets if set
        if (get(settings).switches.clearWidgetsOnStart) {
            context.widget?.post({
                "command": "clear",
            });
        }

        resolve();
    },
};

/*-------------------------------- Exports -----------------------------------*/

export default c;
