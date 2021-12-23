<script lang="ts">
	import Modal from "./Modal.svelte";
	import Tabs from "src/svelte/components/Tabs.svelte";

	import imgBojit from 'src/assets/img/bojit_logo_square.png';

	let tabs = [
		"Global",
		"Components",
		"Logs",
		"About"
	];

	let index = 0;
</script>

<Modal title={"Settings"} confirm={false}>
	<Tabs tabs={tabs} bind:index={index}/>

	{#if tabs[index] === "Global"}
		<div class="my-2">
			<h2>Global</h2>
		</div>
	{:else if tabs[index] === "Components"}
		<div class="my-2">
			<h2>Components</h2>
		</div>
	{:else if tabs[index] === "Logs"}
		<div class="my-2">
			<h2>Logs</h2>
		</div>
	{:else if tabs[index] === "About"}
		<div class="my-2">
			<h2>About</h2>
			<p>
				<b>ploTTY</b> is a serial monitor/plotting application maintained
				by <a href="https://github.com/BOJIT" target="_blank">James Bennion-Pedley</a>.
			</p>
			<!-- TODO generate tag name and link automatically in build step -->
			<h3>Current Release: <a href="https://github.com/BOJIT/ploTTY/releases/tag/0.1.25">0.1.25</a></h3>
			<p>If you have feature requests/issues with this tool let me know on GitHub!</p>
			<a class="centre-child" href="https://bojit.org/" target="_blank">
				<img src="{imgBojit}" alt="BOJIT logo" style="max-height:3.3rem">
			</a>
		</div>
	{/if}
</Modal>

<style lang="scss">
	@charset "utf-8";
	@use "src/styles/_constants.scss";
	@use "src/styles/theme.scss";

	.centre-child {
		display: flex;
		align-items: center;
		justify-content: center;
	}

</style>