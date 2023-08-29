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
    let overlayCanvas: HTMLCanvasElement;
    let resizeObserver: ResizeObserver | null = null;
    let wglp: WebglPlot | null = null;
    let lines: WebglLine[] = [];
    let colours: string[] = [];
    let updatePending: boolean = false;
    let sampleCount = 0;

    // Aesthetics
    let labels: string[] = [];

    // Crosshairs
    let viewCrosshairs: boolean = false;
    const crosshairLines = { xAxis: 0, yAxis: 1, crossX: 2, crossY: 3 };
    let crosshairX = 0;
    let crosshairY = 0;

    /*---------------------------- Helper Functions --------------------------*/

    function sensibleIncrement(inc: number) {
        if (inc < 0.1) return Math.round(inc * 200) / 200;
        if (inc < 1) return Math.round(inc * 20) / 20;
        if (inc < 10) return Math.round(inc);
        if (inc < 100) return Math.round(inc / 20) * 20;
        if (inc < 1000) return Math.round(inc / 200) * 200;
        return 500;
    }

    function getXAxisMode() {
        // Draw true X-axis if within range
        if (resY[0] < 0 && resY[1] > 0) return 0;
        else return resY[0];
    }

    function drawCanvas() {
        const devicePixelRatio = window.devicePixelRatio || 1;
        canvas.width = canvas.offsetWidth * devicePixelRatio;
        canvas.height = canvas.offsetHeight * devicePixelRatio;
        overlayCanvas.width = canvas.width;
        overlayCanvas.height = canvas.height;
        wglp = new WebglPlot(canvas);

        // Set up grid scales
        const diffY = resY[1] - resY[0];
        const avgY = (resY[0] + resY[1]) / 2;
        wglp.gScaleY = 2 / Math.abs(diffY);
        wglp.gOffsetY = -1 * avgY * wglp.gScaleY;
        wglp.gScaleX = 2 / resX;
        wglp.gOffsetX = -0.5 * resX * wglp.gScaleX;

        // Add grid lines
        let axisCol = new ColorRGBA(255, 255, 255, 1);
        if ($theme === "light") {
            axisCol = new ColorRGBA(0, 0, 0, 1);
        }

        const AxisX = new WebglLine(axisCol, 2);
        AxisX.xy = new Float32Array([0, getXAxisMode(), resX, getXAxisMode()]);
        wglp.addAuxLine(AxisX);
        const AxisY = new WebglLine(axisCol, 2);
        AxisY.xy = new Float32Array([0, resY[0], 0, resY[1]]);
        wglp.addAuxLine(AxisY);

        // Re-render existing lines
        lines.forEach((l) => {
            wglp?.addLine(l);
        });

        // Add Crosshairs
        wglp.addAuxLine(new WebglLine(new ColorRGBA(0.1, 0.9, 0.1, 1), 2));
        wglp.addAuxLine(new WebglLine(new ColorRGBA(0.1, 0.9, 0.1, 1), 2));
        wglp.linesAux[crosshairLines.crossX].visible = viewCrosshairs;
        wglp.linesAux[crosshairLines.crossY].visible = viewCrosshairs;

        // Add text overlays
        updatePending = true;

        renderAxisLabels();
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
            lines[i].lineSpaceX(0, 1);
            lines[i].constY(0);
        }

        // Truncate arrays if line number is reduced
        lines.length = numLines;
        colours.length = numLines;
    }

    function renderAxisLabels() {
        const ctx2d = overlayCanvas.getContext("2d");
        if (!ctx2d) return;

        ctx2d.clearRect(0, 0, overlayCanvas.width, overlayCanvas.height);

        // Get X axis position
        const diffY = resY[1] - resY[0];
        const ratio = (getXAxisMode() - resY[0]) / diffY;
        const zeroMark = (1 - ratio) * overlayCanvas.height;

        const incY = sensibleIncrement(diffY / 8); // Try to fit 8 divisions on the axis
        const increment = (overlayCanvas.height * incY) / diffY;

        ctx2d.font = "14px Montserrat";
        ctx2d.lineWidth = 1;
        if ($theme === "light") {
            ctx2d.fillStyle = "black";
            ctx2d.strokeStyle = "black";
        } else {
            ctx2d.fillStyle = "white";
            ctx2d.strokeStyle = "white";
        }
        ctx2d.fillText("Sample #", overlayCanvas.width - 80, zeroMark - 10);

        // Fill out ticks from the X axis
        let startMark = zeroMark;
        for (let i = zeroMark; i > 0; i -= increment) {
            startMark = i;
        }

        ctx2d.font = "12px Montserrat";
        for (let i = startMark; i < overlayCanvas.height; i += increment) {
            let proportion = (overlayCanvas.height - i) / overlayCanvas.height;
            let label = (resY[0] + proportion * diffY).toFixed(2);
            ctx2d.fillText(label, 0, Math.round(i) - 6);
            ctx2d.moveTo(19, Math.round(i));
            ctx2d.lineTo(29, Math.round(i));
            ctx2d.stroke();
        }
    }

    function renderCrosshairs(x: number, y: number): void {
        if (wglp === null) return;

        wglp.linesAux[crosshairLines.crossX].xy = new Float32Array([
            x,
            resY[0],
            x,
            resY[1],
        ]);
        wglp.linesAux[crosshairLines.crossY].xy = new Float32Array([
            0,
            y,
            resX,
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

        for (let i = 0; i < numLines; i++) {
            const fl = new Float32Array(1);
            fl[0] = points[i];
            lines[i].shiftAdd(fl);
        }

        sampleCount++;
        updatePending = true; // Tell frame handler to re-render
    }

    function clear() {
        wglp?.clear();
        createLines();
        drawCanvas();
        sampleCount = 0;
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

    theme.subscribe((t) => {
        if (wglp) {
            drawCanvas();
            renderAxisLabels();
        }
    });

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
    <canvas
        bind:this={overlayCanvas}
        style:pointer-events="none"
        class="overlay"
    />
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
                X: {Math.round(crosshairX) + sampleCount - resX}, Y: {crosshairY.toFixed(
                    3
                )}
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
        position: absolute;
        top: 40px;
        bottom: 10px;
        left: 40px;
        right: 10px;
        width: calc(100% - 50px);
        height: calc(100% - 50px);
    }

    .overlay {
        left: 10px;
        width: calc(100% - 10px);
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
