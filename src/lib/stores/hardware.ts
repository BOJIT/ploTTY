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

import { browser } from "$app/environment";

import localForage from "localforage";

import {
    Bluetooth,
    Desktop,
    GameController,
    Location,
    MusicalNotes,
    Terminal,
} from "@svicons/ionicons-outline";

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

    // Register hardware listener if on frontend
    if (browser)
        registerListeners();

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
            const info = port.getInfo();

            // Note this isn't a unique identifier: it's the best that the API
            // currently offers: https://github.com/WICG/serial/issues/128
            const key = `S-PID${info.usbProductId}-VID${info.usbVendorId}`

            store.update((h) => {
                h[key] = {
                    type: 'serial',
                };
                return h;
            });

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
            // Check browser support
            if (!("requestMIDIAccess" in navigator))
                throw new Error("MIDI API not supported in your browser!");

            // Request acess to all MIDI devices
            const access = await navigator.requestMIDIAccess({
                software: true,
                sysex: true,
            });

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

async function enumerateAccess(hardware): Promise<object> {
    if (!browser)
        return {};  // Server-side renders an empty list

    const enumeration: any = {};

    if ("serial" in navigator) {
        const ports = await navigator.serial.getPorts();

        ports.forEach((p) => {
            let info = p.getInfo();
            enumeration[`S-PID${info.usbProductId}-VID${info.usbVendorId}`] = {
                icon: Terminal,

            };
        })
    }

    // TODO add bluetooth enumeration

    const midiEnabled = await navigator.permissions.query({ name: "midi", sysex: true });
    if (midiEnabled.state === "granted")
        enumeration["MIDI"] = { icon: MusicalNotes };

    const gpsEnabled = await navigator.permissions.query({ name: "geolocation" });
    if (gpsEnabled.state === "granted")
        enumeration["GPS"] = { icon: Location };

    return enumeration;
}

async function registerListeners() {
    // register connect/disconnect events to update the hardware store

    if ("serial" in navigator) {

        navigator.serial.addEventListener("connect", (e) => {
            store.update((h) => h);
            // Currently cannot assign any ID: see https://github.com/WICG/serial/issues/128
        });

        navigator.serial.addEventListener("disconnect", (e) => {
            store.update((h) => h);
        });
    }

    // TODO add bluetooth listeners
}

/*-------------------------------- Exports -----------------------------------*/

export default {
    subscribe: store.subscribe,
    set: store.set,
    update: store.update,
    init,
    reset,
    addDevice,
    enumerateAccess,
    registerListeners,
}
