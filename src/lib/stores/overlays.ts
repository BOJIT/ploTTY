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
const editorOverlay: Writable<boolean> = writable(false);

/*------------------------------- Functions ----------------------------------*/

/*-------------------------------- Exports -----------------------------------*/

export {
    themeOverlay,
    editorOverlay,
};
