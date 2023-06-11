/**
 * @file overlays.ts
 * @author James Bennion-Pedley
 * @brief Share app-wide overlay state
 * @date 07/02/2023
 *
 * @copyright Copyright (c) 2023
 *
 */

/*-------------------------------- Imports -----------------------------------*/

import { writable, type Writable } from "svelte/store";

/*--------------------------------- State ------------------------------------*/

const themeOverlay: Writable<boolean> = writable(false);
const editorOverlay: Writable<boolean> = writable(true);
const newPatchOverlay: Writable<boolean> = writable(false);
const openPatchOverlay: Writable<boolean> = writable(false);
const duplicatePatchOverlay: Writable<boolean> = writable(false);
const settingsOverlay: Writable<boolean> = writable(false);
const menuOverlay: Writable<boolean> = writable(false);
const extendedSettingsOverlay: Writable<boolean> = writable(false);
const addComponentOverlay: Writable<boolean> = writable(false);
const componenSettingsOverlay: Writable<boolean> = writable(false);

/*------------------------------- Functions ----------------------------------*/

/*-------------------------------- Exports -----------------------------------*/

export {
    themeOverlay,
    editorOverlay,
    newPatchOverlay,
    openPatchOverlay,
    duplicatePatchOverlay,
    settingsOverlay,
    menuOverlay,
    extendedSettingsOverlay,
    addComponentOverlay,
    componenSettingsOverlay,
};
