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

import LineChart from "./LineChart.svelte";

/*-------------------------------- Component ---------------------------------*/

const c: PlottyComponent = {
    name: "line chart",
    category: 'widgets',
    widget: LineChart,
    ui: {
        icon: Analytics,
    },
    inPorts: {
        data: {
            default: {},
        },
        labels: {
            datatype: 'string',
        }
    },
    process: (input, output) => {

    },
};

/*-------------------------------- Exports -----------------------------------*/

export default c;
