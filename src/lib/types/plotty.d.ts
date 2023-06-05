/**
 * @file plotty.d.ts
 * @author James Bennion-Pedley
 * @brief Interface types for plotty components and patches
 * @date 30/05/2023
 *
 * @copyright Copyright (c) 2023
 *
 */

/*-------------------------------- Imports -----------------------------------*/

import type { SvelteComponent } from "svelte";

import type { CSSColorString } from "svelvet";
import type { GraphJson } from "$lib/middlewares/fbp-graph/Graph"
import type { ProcessingFunction } from "noflo/lib/Component";

/*------------------------------ Partial Types -------------------------------*/

type Datatype = 'string' | 'number' | 'boolean' | 'object' | 'signal'

type Port = {
    datatype?: Datatype,    // If not set, assume 'any'
    enumeration?: string[] | number[] | boolean[],  // Array of pre-determined values
    default?: string | number | boolean | {},    // Default value (should be in enumeration)
}

type Ports = {
    [key: string]: Port,
}

type Metadata = {
    version: string,
    exportDate?: string,
}

/*--------------------------------- Types ------------------------------------*/

interface PlottyWidget extends SvelteComponent {
    reset(): Function,
    update(): Function,
    generate(): Function,
}

type PlottyComponent = {
    name: string,       // Name of component (part AFTER trailing slash)
    category?: string,  // Name of category (part BEFORE trailing slash)
    ui?: {
        icon?: typeof SvelteComponent,  // @svicons/*
        colour?: CSSColorString, // If unset, uses default component colours
    },
    widget?: PlottyWidget,  // Widget for graph outputs
    inputs?: Ports,         // Object containing input 'anchors'
    outputs?: Ports,        // Object containing output 'anchors'
    process: ProcessingFunction,        // The primary component logic
    teardown?: Promise<void> | void,    // Optional function called on halting of graph
}

type PlottyPatch = {
    key: string         // Duplicate of library key (useful for comprehensions)
    metadata: Metadata  // Patch metadata
    graph: GraphJson    // Graph itself
}

/*-------------------------------- Exports -----------------------------------*/

export type {
    PlottyWidget,
    PlottyComponent,
    PlottyPatch,
};
