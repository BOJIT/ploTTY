<script lang="ts">
	import type { PanelData } from 'src/svelte/store/panels';
	import { onDestroy, onMount } from 'svelte';

	/* XTermJS */
	import { Terminal } from 'xterm';
	
	import "xterm/css/xterm.css"
	import { FitAddon } from 'xterm-addon-fit';
	let container;
	let terminal;
	let fitAddon;

	function terminalFit() {
		if(fitAddon !== undefined) {
			fitAddon.fit();
		}
	}

	export function update(data: PanelData) {
		let s = data.data as string;
		terminal.write(s);
	};

	onMount(() => {
		terminal = new Terminal({
			theme: { background: '#00000000' },
			allowTransparency: true,
			convertEol: true
		});

		const fitAddon = new FitAddon();
		terminal.loadAddon(fitAddon);

		terminal.open(container);
		terminalFit();
		window.addEventListener('resize', terminalFit);
	});

	onDestroy(() => {
		window.removeEventListener('resize', terminalFit);
	})
</script>

<div class="xterm-container" bind:this={container}>

</div>

<style lang="scss">
	@charset "utf-8";
	@use "src/styles/_constants.scss";
	@use "src/styles/theme.scss";

	:global(.xterm-viewport)::-webkit-scrollbar {
		display: none;
	}
	:global(.xterm-viewport) {
		-ms-overflow-style: none;
		scrollbar-width: none; /* Firefox */
	}
</style>
