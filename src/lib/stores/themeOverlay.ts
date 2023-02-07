/**
 * @file themeOverlay.ts
 * @author James Bennion-Pedley
 * @brief Is theme selector showing?
 * @date 07/02/2023
 *
 * @copyright Copyright (c) 2023
 *
 */

/*-------------------------------- Imports -----------------------------------*/

import { writable } from "svelte/store";

/*--------------------------------- State ------------------------------------*/

const initial: boolean = false;
const store = writable(initial);

/*------------------------------- Functions ----------------------------------*/

/*-------------------------------- Exports -----------------------------------*/

export default store
