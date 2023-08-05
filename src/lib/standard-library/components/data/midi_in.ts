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

/*---------------------------------- Types -----------------------------------*/

type MidiStatus = "note-off" | "note-on" | "key-pressure" | "control-change" | "program-change" | "channel-pressure" | "pitch-bend" | "system";

type MidiMessage = {
    type: MidiStatus,
    channel?: number,
    data1: number,
    data2: number,
};

/*---------------------------------- State -----------------------------------*/

const STATUS_MAP: { [key: string]: MidiStatus } = {
    "8": "note-off",
    "9": "note-on",
    "a": "key-pressure",
    "b": "control-change",
    "c": "program-change",
    "d": "channel-pressure",
    "e": "pitch-bend",
    "f": "system",
};

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
                const isSystem = m.data[0] & (1 << 7);
                const msg_type = (m.data[0] >> 4).toString(16);
                const chan_num = (isSystem || msg_type === "system") ? 0 : (m.data[0] % 16);

                // TODO filter if wrong channel

                const msg: MidiMessage = {
                    type: STATUS_MAP[msg_type],
                    channel: chan_num,
                    data1: m.data[1],
                    data2: m.data[2],
                }
                output.send({
                    out: msg,
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
