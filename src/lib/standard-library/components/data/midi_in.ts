/**
 * @file midi_in.ts
 * @author James Bennion-Pedley
 * @brief Component to capture MIDI input commands
 * @date 23/07/2023
 *
 * @copyright Copyright (c) 2023
 *
 */

/*-------------------------------- Imports -----------------------------------*/

import type { PlottyComponent } from "$lib/types/plotty";
import { MusicalNotes } from "@svicons/ionicons-outline";

/*-------------------------------- Component ---------------------------------*/

const c: PlottyComponent = {
    name: "midi-in",
    category: 'data',
    ui: {
        icon: MusicalNotes,
    },
    inPorts: {
        channel: {
            default: {},
        },
    },
    outPorts: {
        out: {
            default: {},
        },
    },
    process: (input, output) => {

    },
};

/*-------------------------------- Exports -----------------------------------*/

export default c;
