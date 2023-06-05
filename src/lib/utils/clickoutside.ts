/**
 * @file clickoutside.ts
 * @author James Bennion-Pedley
 * @brief Svelte use directive for detecting external clicks
 * @date 29/05/2023
 *
 * @copyright Copyright (c) 2023
 *
 */

/*-------------------------------- Imports -----------------------------------*/

import type { Action } from "svelte/types/runtime/action";

/*-------------------------------- Exports -----------------------------------*/

/** Dispatch event on click outside of node */
export const clickOutside: Action<HTMLElement, undefined> = (node) => {

    const handleClick = (event: any) => {
        if (node && !node.contains(event.target) && !event.defaultPrevented) {
            node.dispatchEvent(
                new CustomEvent('click_outside', node)
            )
        }
    }

    document.addEventListener('click', handleClick, true);

    return {
        destroy() {
            document.removeEventListener('click', handleClick, true);
        }
    }
}
