<!--
 * @file LineChart.svelte
 * @author James Bennion-Pedley
 * @brief Line Chart Widget
 * @date 05/06/2023
 *
 * @copyright Copyright (c) 2023
 *
-->
<svelte:options accessors={true} />

<script lang="ts">
    /*-------------------------------- Imports -------------------------------*/

    import { onDestroy, onMount } from "svelte";

    import theme from "@bojit/svelte-components/theme";

    /* WebGL-Plot */
    import { WebglPlot, WebglLine, ColorRGBA } from "webgl-plot";
    import { Switch } from "@bojit/svelte-components/smelte";

    /*--------------------------------- Props --------------------------------*/

    // Config options
    let resX: number = 100;
    let resY: [number, number] = [-1, 1];
    let numLines: number = 1;

    // Core
    let canvas: HTMLCanvasElement;
    let resizeObserver: ResizeObserver | null = null;
    let wglp: WebglPlot | null = null;
    let lines: WebglLine[] = [];
    let colours: string[] = [];
    let updatePending: boolean = false;

    // Aesthetics
    const fullRange = 1;
    let labels: string[] = [];

    // Crosshairs
    let viewCrosshairs: boolean = false;
    const crosshairLines = { xAxis: 0, yAxis: 1, crossX: 2, crossY: 3 };
    let crosshairX = 0;
    let crosshairY = 0;

    /*---------------------------- Helper Functions --------------------------*/

    function getYAxisPosition() {
        if (resY[0] < 0 && resY[1] > 0) {
            let rangeProportion = Math.abs(resY[0]) / (resY[1] - resY[0]);
            return -fullRange + 2 * fullRange * rangeProportion;
        } else {
            return -fullRange;
        }
    }

    function drawCanvas() {
        const devicePixelRatio = window.devicePixelRatio || 1;
        canvas.width = canvas.clientWidth * devicePixelRatio;
        canvas.height = canvas.clientHeight * devicePixelRatio;
        wglp = new WebglPlot(canvas);

        // Add grid lines
        const AxisX = new WebglLine(new ColorRGBA(255, 255, 255, 255), resX);
        AxisX.arrangeX();
        AxisX.constY(getYAxisPosition());
        wglp.addAuxLine(AxisX);

        const AxisY = new WebglLine(new ColorRGBA(255, 255, 255, 255), resX);
        for (let i = 0; i < resX; i++) {
            const n = -fullRange + (2 * fullRange * i) / resX;
            AxisY.setX(i, -1);
            AxisY.setY(i, n);
        }
        wglp.addAuxLine(AxisY);

        lines.forEach((l) => {
            wglp?.addLine(l);
        });

        // Add Crosshairs
        wglp.addAuxLine(new WebglLine(new ColorRGBA(0.1, 0.9, 0.1, 1), 2));
        wglp.addAuxLine(new WebglLine(new ColorRGBA(0.1, 0.9, 0.1, 1), 2));
        wglp.linesAux[crosshairLines.crossX].visible = viewCrosshairs;
        wglp.linesAux[crosshairLines.crossY].visible = viewCrosshairs;

        updatePending = true;
    }

    function createLines() {
        for (let i = 0; i < numLines; i++) {
            const swatch = theme.swatchColorJS(i);

            let p = 1;
            const colour = new ColorRGBA(
                swatch[p][0] / 255,
                swatch[p][1] / 255,
                swatch[p][2] / 255,
                1
            );

            colours[
                i
            ] = `rgb(${swatch[p][0]}, ${swatch[p][1]}, ${swatch[p][2]})`;
            lines[i] = new WebglLine(colour, resX);
            lines[i].arrangeX();
            lines[i].constY(getYAxisPosition());
        }

        // Truncate arrays if line number is reduced
        lines.length = numLines;
        colours.length = numLines;
    }

    function renderCrosshairs(x: number, y: number): void {
        if (wglp === null) return;

        wglp.linesAux[crosshairLines.crossX].xy = new Float32Array([
            x,
            -1,
            x,
            1,
        ]);
        wglp.linesAux[crosshairLines.crossY].xy = new Float32Array([
            -1,
            y,
            1,
            y,
        ]);
        crosshairX = x;
        crosshairY = y;
        updatePending = true;
    }

    function mouseMove(e: MouseEvent): void {
        if (wglp === null) return;

        if (!viewCrosshairs) return;

        const boundingBox = canvas.getBoundingClientRect();

        const x =
            (1 / wglp.gScaleX) *
            ((2 *
                ((e.pageX - boundingBox.left) * devicePixelRatio -
                    canvas.width / 2)) /
                canvas.width -
                wglp.gOffsetX);
        const y =
            (1 / wglp.gScaleY) *
            ((2 *
                (canvas.height / 2 -
                    (e.pageY - boundingBox.top) * devicePixelRatio)) /
                canvas.height -
                wglp.gOffsetY);
        renderCrosshairs(x, y);
    }

    /*-------------------------------- Methods -------------------------------*/

    function update(points: number[]) {
        if (points.length !== numLines) {
            // Change in number of lines clears the screen
            numLines = points.length;
            clear();
        }

        const sf = (2 * fullRange) / (resY[1] - resY[0]);
        let rangeProportion = Math.abs(resY[0]) / (resY[1] - resY[0]);
        let ofst = -fullRange + 2 * fullRange * rangeProportion;

        if (resY[0] < 0 && resY[1] > 0) {
        } else {
            ofst = -fullRange - resY[0] * sf;
        }

        for (let i = 0; i < numLines; i++) {
            const fl = new Float32Array(1);
            fl[0] = points[i] * sf + ofst;
            lines[i].shiftAdd(fl);
        }

        updatePending = true; // Tell frame handler to re-render
    }

    function clear() {
        wglp?.clear();
        createLines();
        drawCanvas();
    }

    /*----------------------------- Graph Methods ----------------------------*/

    // Mandatory recv callback (call this to send to NoFlo)
    export let postToGraph = (m: any) => {
        return;
    };

    export function postFromGraph(message: any) {
        // Pass array to plotter
        if (Array.isArray(message)) update(message);
        // Send control messages as objects
        else if (typeof message == "object") {
            switch (message.command) {
                case "limits": {
                    resX = message.data.x;
                    resY = message.data.y;
                    break;
                }

                case "labels": {
                    labels = message.data;
                    break;
                }

                case "clear": {
                    clear();
                    break;
                }
            }
        }
    }

    /*------------------------------- Lifecycle ------------------------------*/

    onMount(() => {
        createLines();
        drawCanvas();

        // Redraw on size change
        resizeObserver = new ResizeObserver(function (entries) {
            drawCanvas();
        });
        resizeObserver.observe(canvas);
        canvas.addEventListener("mousemove", mouseMove);

        // Register new frame callback
        function newFrame() {
            if (updatePending) {
                wglp?.update();
                updatePending = false;
            }
            requestAnimationFrame(newFrame);
        }
        requestAnimationFrame(newFrame);
    });

    onDestroy(() => {
        resizeObserver?.unobserve(canvas);
    });
</script>

<div class="container">
    <canvas bind:this={canvas} />
    <div class="labels">
        {#each labels as l, idx}
            {#if colours[idx] !== undefined}
                {@const c = colours[idx]}
                <div class="legend-entry">
                    <div class="legend-square" style="background-color: {c};" />
                    {l}
                </div>
            {/if}
        {/each}
        <div class="push" />
        {#if viewCrosshairs}
            <p class="cursors">
                X: {crosshairX.toFixed(3)}, Y: {crosshairY.toFixed(3)}
            </p>
        {/if}
        <div class="cursor-toggle">
            <Switch
                label="cursors"
                bind:value={viewCrosshairs}
                on:change={() => {
                    if (wglp === null) return;

                    wglp.linesAux[crosshairLines.crossX].visible =
                        viewCrosshairs;
                    wglp.linesAux[crosshairLines.crossY].visible =
                        viewCrosshairs;

                    updatePending = true;
                }}
            />
        </div>
    </div>
</div>

<style>
    .container {
        width: 100%;
        height: 100%;
        padding-top: 1rem;

        position: relative;
    }

    canvas {
        margin: 0.5rem;
        margin-top: 2rem;
        margin-bottom: 2rem;
        width: 100%;
        height: 100%;
    }

    .labels {
        position: absolute;
        top: 0px;
        left: 0px;
        margin: 0.5rem;
        overflow: hidden;

        display: flex;
        flex-direction: row;
        gap: 0.6rem;
        height: 2rem;
        width: 100%;
    }

    .push {
        flex-grow: 1;
    }

    .cursor-toggle {
        padding-top: 0.2rem;
        margin-left: 0.4rem;
        min-width: 8rem;
    }

    .cursors {
        flex-shrink: 0;
        justify-content: flex-end;
        align-self: center;
    }

    .legend-entry {
        display: flex;
        align-items: center;
        gap: 0.2rem;
    }

    .legend-square {
        width: 0.75rem;
        height: 0.75rem;
        border-radius: 0.2rem;
        background-color: red;
    }
</style>
