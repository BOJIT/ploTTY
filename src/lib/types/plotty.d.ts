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

import type { SvelteComponent, SvelteComponentTyped } from "svelte";

import type { CSSColorString } from "svelvet";
import type { GraphJson } from "$lib/middlewares/fbp-graph/Graph"
import type { ProcessingFunction } from "$lib/middlewares/noflo/Component";

// TEMP
type InitialisationFunction = (resolve: () => {}, reject: (err: any) => {}, context: any) => Promise<void>

/*------------------------------ Partial Types -------------------------------*/

type Datatype = 'string' | 'number' | 'boolean' | 'object' | 'bang'

type PortEnumeration = string[] | number[] | boolean[]

type Port = {
    datatype?: Datatype,    // If not set, assume 'any'
    enumeration?: PortEnumeration | (() => Promise<(PortEnumeration)>),  // Array of pre-determined values
    default?: string | number | boolean | {},    // Default value (should be in enumeration)
    codeDefault?: string;   // Default code snippet populated
}

type Ports = {
    [key: string]: Port,
}

type Metadata = {
    version: string,
    exportDate?: string,
    dependencies?: PlottyLibraryManifest[],
}

/*--------------------------------- Types ------------------------------------*/

type PlottyPortMode = "input" | "enum" | "custom"

type PlottyPortConfig = {
    [key: string]: {
        mode: PlottyPortMode
        codeString?: string,   // Stores custom code for port input (if used)
        chosenEnumeration?: string | number | boolean | {}, // Chosen enumeration for port input (if used)
    },
};

// TODO work out how to strongly type this
class PlottyWidget extends SvelteComponentTyped<{
    postToGraph?: (m: any) => void,
}> {
    postFromGraph(m: any): void { }
}

type PlottyComponent = {
    name: string,       // Name of component (part AFTER trailing slash)
    category?: string,  // Name of category (part BEFORE trailing slash). Defaults to library name
    ui?: {
        icon?: typeof SvelteComponent,  // @svicons/*
        colour?: CSSColorString, // If unset, uses default component colours
    },
    widget?: typeof PlottyWidget,  // Widget for graph outputs
    inPorts?: Ports,         // Object containing input 'anchors'
    outPorts?: Ports,        // Object containing output 'anchors'
    process: ProcessingFunction,    // The primary component logic
    init?: InitialisationFunction,     // Optional function called on initialising of graph
    deinit?: InitialisationFunction,   // Optional function called on halting of graph
    state?: object  // Any runtime state (for cleanup, etc...)
}

type PlottyPatch = {
    key: string         // Duplicate of library key (useful for comprehensions)
    metadata: Metadata  // Patch metadata
    graph: GraphJson    // Graph itself
}

type PlottyLibraryManifest = {
    name: string        // Part of name shown before the category
    version: string     // Release of the library
    url?: string        // Allow new versions to be automatically fetched
}

type PlottyComponentMetadata = {
    position: {
        x: number,
        y: number,
    },
    label?: string  // If unset, component type is used
    portConfig?: PlottyPortConfig
}

/*-------------------------------- Exports -----------------------------------*/

export type {
    Port as PlottyPort,
    PlottyComponent,
    PlottyComponentMetadata,
    PlottyPatch,
    PlottyPortConfig,
    PlottyPortMode,
    PlottyWidget,
};
