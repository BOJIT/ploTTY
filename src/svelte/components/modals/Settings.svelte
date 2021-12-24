<script lang="ts">
	import Modal from "./Modal.svelte";
	import Tabs from "src/svelte/components/Tabs.svelte";
	import Icon from 'svelte-awesome';
	import { faAdjust, faFileExport, faFileImport, faMoon, faSun, faTrash } from '@fortawesome/free-solid-svg-icons';

	import imgBojit from 'src/assets/img/bojit_logo_square.png';

	import Selector from "src/svelte/components/Selector.svelte";
	import { modal } from 'src/svelte/store/overlays';
	import Modals from '../modals';

	/* TODO - put theme toggle in settings loader */
	import theme from 'src/svelte/store/theme';

	let tabs: string[] = [
		"Global",
		"Components",
		"Logs",
		"About"
	];

	let components: string[] = [
		"Data/SerialIn",
		"Data/SerialOut",
		"Data/BluetoothIn",
		"Data/BluetoothOut",
		"Panel/TimePlot",
		"Panel/XYPlot",
		"Panel/Terminal",
		"Core/Reshape",
		"Core/Filter"
	];

	let logs: string[] = [
		"Example_Log_1",
		"Example_Log_2"
	];

	let index = 0;
</script>

<Modal title={"Settings"} confirm={false}>
	<Tabs tabs={tabs} bind:index={index}/>

	<!-- Global Tab -->
	<div class="tab-group">
		<div class="my-2 tab" style="visibility: {(tabs[index] === 'Global') ? 'visible' : 'hidden' }">
			<h2>Config</h2>
			<br>
			<button class="button mr-2">
				<span class="icon"><Icon data={faFileImport} /></span>
				<span>Import</span>
			</button>
			<button class="button mr-2">
				<span class="icon"><Icon data={faFileExport} /></span>
				<span>Export</span>
			</button>
			<button on:click={() => {
					$modal = Modals.Confirm;
				}} class="button mr-2 is-danger">
				<span class="icon"><Icon data={faTrash} /></span>
				<span>Reset</span>
			</button>
			<hr>
			<h2>Colour Scheme</h2>
			<br>
			<div class="field has-addons">
				<p class="control">
					<button on:click={() => {
						if($theme.mode === "dark") {
							$theme.mode = "light";
						} else {
							$theme.mode = "dark";
						}
					}} class="button">
						<span class="icon"><Icon data={faSun} /></span>
						<span>Light</span>
					</button>
				</p>
				<p class="control">
					<button class="button">
						<span class="icon"><Icon data={faAdjust} /></span>
						<span>Auto</span>
					</button>
				</p>
				<p class="control">
					<button class="button selected">
						<span class="icon"><Icon data={faMoon} /></span>
						<span>Dark</span>
					</button>
				</p>
			</div>
		</div>

		<!-- Components -->
		<div class="my-2 tab" style="visibility: {(tabs[index] === 'Components') ? 'visible' : 'hidden' }">
			<br>
			<Selector placeholder={"User Components"} selections={components} height="12rem" />
			<br>
			<button class="button mr-2">
				<span class="icon"><Icon data={faFileImport} /></span>
				<span>Upload</span>
			</button>
			<button on:click={() => {
					$modal = Modals.Confirm;
				}} class="button mr-2 is-danger">
				<span class="icon"><Icon data={faTrash} /></span>
				<span>Delete All</span>
			</button>
		</div>

		<!-- Logs -->
		<div class="my-2 tab" style="visibility: {(tabs[index] === 'Logs') ? 'visible' : 'hidden' }">
			<br>
			<Selector placeholder={"Logs"} selections={logs} height="7rem" />
			<br>
			<button on:click={() => {
					$modal = Modals.Confirm;
				}} class="button mr-2 is-danger">
				<span class="icon"><Icon data={faTrash} /></span>
				<span>Delete All</span>
			</button>
		</div>

		<!-- About -->
		<div class="my-2 tab" style="visibility: {(tabs[index] === 'About') ? 'visible' : 'hidden' }">
			<h2>About</h2>
			<p>
				<b>ploTTY</b> is a serial monitor/plotting application maintained
				by <a href="https://github.com/BOJIT" target="_blank">James Bennion-Pedley</a>.
			</p>
			<hr>
			<!-- TODO generate tag name and link automatically in build step -->
			<h3>Current Release: <a href="https://github.com/BOJIT/ploTTY/releases/tag/0.1.25">0.1.25</a></h3>
			<p>If you have feature requests/issues with this tool let me know on GitHub!</p>
			<hr>
			<a class="centre-child" href="https://bojit.org/" target="_blank">
				<img src="{imgBojit}" alt="BOJIT logo" style="max-height:3.3rem">
			</a>
		</div>
	</div>
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

	img {
		@include theme.themed() {
			filter: brightness(theme.t(theme.$filter-white));
		}
	}

	.tab-group {
		display: grid;
		grid-template-columns: 1fr;
		grid-template-rows: 1fr;
	}

	.tab {
		grid-column: 1;
		grid-row: 1;
	}
</style>