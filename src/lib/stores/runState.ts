/**
 * @file runState.ts
 * @author James Bennion-Pedley
 * @brief Information on current plotter state
 * @date 07/02/2023
 *
 * @copyright Copyright (c) 2023
 *
 */

/*-------------------------------- Imports -----------------------------------*/

import { writable, type Writable } from "svelte/store";

/*--------------------------------- State ------------------------------------*/

const graphRunning: Writable<boolean> = writable(false);

/*------------------------------- Functions ----------------------------------*/

/*-------------------------------- Exports -----------------------------------*/

export {
    graphRunning,
}
