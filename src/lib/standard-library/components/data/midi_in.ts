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
        device: {
            datatype: 'string',
            default: 'any',
            enumeration: async () => {
                try {
                    const access = await navigator.requestMIDIAccess();
                    const names: string[] = [];

                    for (const entry of access.inputs) {
                        if (entry[1].name)
                            names.push(entry[1].name);
                    }

                    return names;
                } catch (e) {
                    return [];
                }
            },
        },
        channel: {
            datatype: 'number',
            default: 0,
            enumeration: [
                0,  // Any
                1,
                2,
                3,
                4,
                5,
                6,
                7,
                8,
                9,
                10,
                11,
                12,
                13,
                14,
                15,
                16,
            ]
        },
    },
    outPorts: {
        out: {
            default: {},
        },
    },
    process: (input, output) => {

    },
    init: async (resolve, reject, context) => {
        const access = await navigator.requestMIDIAccess();

        console.log(access.inputs);

        for (const entry of access.inputs) {
            const input = entry[1];
            console.log(
                `Input port [type:'${input.type}']` +
                ` id:'${input.id}'` +
                ` manufacturer:'${input.manufacturer}'` +
                ` name:'${input.name}'` +
                ` version:'${input.version}'`,
            );
        }

        resolve();
    },
};

/*-------------------------------- Exports -----------------------------------*/

export default c;
