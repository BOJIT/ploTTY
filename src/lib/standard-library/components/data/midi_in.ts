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
        out: {},
    },
    process: (input, output, context) => {
        if (input.hasData('device')) {
            const target = input.getData('device');

            // If device is enumerated, attach listener
            const names: any = {};

            for (const entry of context.nodeInstance.state.midiAccess.inputs) {
                if (entry[1].name)
                    names[entry[1].name] = entry[1];
            }

            if (!(target in names)) {
                throw new Error(`Selected Device [${target}] cannot be opened!`);
            }

            // Send MIDI messages as arrays
            names[target].onmidimessage = (m) => {
                output.send({
                    out: Array.from(m.data).join(', '),
                });
            }
        }

        // if (input.hasData('channel'))
        //     console.log(`Channel: ${input.getData('channel')}`);
    },
    init: async (resolve, reject, context) => {
        // Request access to MIDI API
        context.state.midiAccess = await navigator.requestMIDIAccess();

        resolve();
    },
    deinit: async (resolve, reject, context) => {
        for (const entry of context.state.midiAccess.inputs) {
            // Remove all listeners
            entry[1].onmidimessage = undefined;
        }

        resolve();
    },
};

/*-------------------------------- Exports -----------------------------------*/

export default c;
