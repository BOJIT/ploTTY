<!--
 * @file LineChart.svelte
 * @author James Bennion-Pedley
 * @brief Line Chart Widget
 * @date 05/06/2023
 *
 * @copyright Copyright (c) 2023
 *
-->

<script lang="ts">
    /*-------------------------------- Imports -------------------------------*/

    import { onDestroy, onMount } from "svelte";

    import theme from "@bojit/svelte-components/theme";

    /* WebGL-Plot */
    import { WebglPlot, WebglLine, ColorRGBA } from "webgl-plot";

    /*--------------------------------- Props --------------------------------*/

    export let demo: boolean = true;

    export let resX: number = 100;
    export let resY: [number, number] = [-1, 1];
    export let numLines: number = 3;

    let canvas: HTMLCanvasElement;
    let resizeObserver: ResizeObserver | null = null;
    let wglp: WebglPlot | null = null;

    let lines: WebglLine[] = [];
    let colours: string[] = [];

    const fullRange = 0.9;

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

    function demoSignals() {
        const freq = 0.005;
        const amp = 0.7;
        const noise = 0.1;
        const phaseStep = (2 * Math.PI) / numLines;

        for (let l = 0; l < numLines; l++) {
            for (let i = 0; i < lines[l].numPoints; i++) {
                const ySin = Math.sin(
                    Math.PI * i * freq * Math.PI * 2 + l * phaseStep
                );
                const yNoise = Math.random() - 0.5;
                lines[l].setY(i, ySin * amp + yNoise * noise);
            }
        }
    }

    /*-------------------------------- Methods -------------------------------*/

    export function post(message: any) {
        console.log(message);
    }

    export function get() {
        return {};
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

        // Register new frame callback
        function newFrame() {
            if (demo) demoSignals();

            wglp?.update();
            requestAnimationFrame(newFrame);
        }
        requestAnimationFrame(newFrame);
    });

    onDestroy(() => {
        resizeObserver?.unobserve(canvas);
    });
</script>

<canvas bind:this={canvas} />

<style>
    canvas {
        margin: 0.5rem;
        width: 100%;
        height: 100%;
    }
</style>
