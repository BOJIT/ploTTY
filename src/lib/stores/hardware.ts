/**
 * @file hardware.ts
 * @author James Bennion-Pedley
 * @brief Handles hardware permissions synchronisation with IndexedDB
 * @date 09/02/2023
 *
 * @copyright Copyright (c) 2023
 *
 */

/*-------------------------------- Imports -----------------------------------*/

import { writable, type Writable } from "svelte/store";

import localForage from "localforage";

/*--------------------------------- Types ------------------------------------*/

export type HardwareType = "serial" | "bluetooth" | "midi" | "websocket" | "gamepad" | "gps";

type HardwareEntry = {
    type: HardwareType,
};

type Hardware = {
    [key: string]: HardwareEntry,
};

/*--------------------------------- State ------------------------------------*/

const store: Writable<Hardware> = writable({});
const localStore: LocalForage = localForage.createInstance({
    name: "hardware"
});

/*-------------------------------- Helpers -----------------------------------*/

function getPosition(options?: PositionOptions): Promise<GeolocationPosition> {
    return new Promise((resolve, reject) =>
        navigator.geolocation.getCurrentPosition(resolve, reject, options)
    );
}

/*------------------------------- Functions ----------------------------------*/

async function init(): Promise<Writable<Hardware>> {
    // Does local store exist?
    let entry = await localStore.getItem("hardware");

    // Get localStorage if it exists
    if (entry !== null)
        store.set(entry as Hardware);

    /* Local storage is subscribed to store updates */
    store.subscribe(async (val: Hardware) => {
        await localStore.setItem("hardware", val);
    });

    return store;
}

async function reset(): Promise<void> {
    await localStore.clear();
    store.set({});          // Reset all stores
}

async function addDevice(type: HardwareType): Promise<void> {
    switch (type) {
        case "serial": {
            // Check browser support
            if (!("serial" in navigator))
                throw new Error("Serial API not supported in your browser!");

            // Request device (no filters currently)
            let port = await navigator.serial.requestPort();

            break;
        }

        case "bluetooth": {
            // Check browser support
            if (!("bluetooth" in navigator))
                throw new Error("Bluetooth API not supported in your browser!");

            // Request device (no filters currently)
            const device = await navigator.bluetooth.requestDevice({
                acceptAllDevices: true,
            });

            break;
        }

        case "midi": {
            // No browser check: mandatory support

            // Request acess to all MIDI devices
            const access = await navigator.requestMIDIAccess({
                software: true,
                sysex: true,
            });

            console.log(access);

            break;
        }

        case "gps": {
            // Check browser support
            if (!("geolocation" in navigator))
                throw new Error("Geolocation API not supported in your browser!");

            // Getting one position is sufficient to keep permissions
            const position = await getPosition();

            break;
        }

        default:
            throw new Error("Hardware type not supported (yet)");
            break;
    }
}

async function enumerateAccess(hardware): Promise<string[]> {

}

/*-------------------------------- Exports -----------------------------------*/

export default {
    subscribe: store.subscribe,
    set: store.set,
    update: store.update,
    init,
    reset,
    addDevice,
}
