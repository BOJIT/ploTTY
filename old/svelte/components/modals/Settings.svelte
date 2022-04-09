<script lang="ts">
	import Icon from 'svelte-awesome';
	import { faAdjust, faFileExport, faFileImport, faMoon, faSun, faTrash } from '@fortawesome/free-solid-svg-icons';
	
	import imgBojit from 'src/assets/img/bojit_logo_square.png';
	
	import Modal from "./Modal.svelte";
	import Modals from '../modals';
	import Tabs from "src/svelte/components/Tabs.svelte";
	import Selector from "src/svelte/components/Selector.svelte";

	import { modal } from 'src/svelte/store/overlays';
	import settings from 'src/svelte/store/settings';
	import components from 'src/svelte/store/components';
	import storage from 'src/svelte/store/storage';

	/* Import environment variables */
	import env from 'src/env';

	let tabs: string[] = [
		"Global",
		"Components",
		"Logs",
		"About"
	];

	// TODO move logs to store eventually
	let logs: string[] = [
		"Example_Log_1",
		"Example_Log_2"
	];

	export let index = 0;
</script>

<Modal title={"Settings"} confirm={false}>
	<Tabs tabs={tabs} bind:index={index}/>

	<!-- Global Tab -->
	<div class="tab-group">
		<div class="my-2 tab" style="visibility: {(tabs[index] === 'Global') ? 'visible' : 'hidden' }">
			<h2>Config</h2>
			<br>
			<button on:click={() => {
					storage.importConfig();
				}} class="button mr-2">
				<span class="icon"><Icon data={faFileImport} /></span>
				<span>Import</span>
			</button>
			<button on:click={() => {
					storage.exportConfig();
				}} class="button mr-2">
				<span class="icon"><Icon data={faFileExport} /></span>
				<span>Export</span>
			</button>
			<button on:click={() => {
					$modal = { 
						component: Modals.Confirm,
						props: {
							title: "Reset to Factory Defaults",
							confirmHook: (() => {
								storage.clear();
								$modal = Modals.Settings;
							}),
							cancelHook: (() => {
								$modal = Modals.Settings;
							})
						}
					};
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
						$settings.colourScheme = "light";
					}} class="button" class:selected={$settings.colourScheme == "light"}>
						<span class="icon"><Icon data={faSun} /></span>
						<span>Light</span>
					</button>
				</p>
				<p class="control">
					<button on:click={() => {
						$settings.colourScheme = "auto";
					}} class="button" class:selected={$settings.colourScheme == "auto"}>
						<span class="icon"><Icon data={faAdjust} /></span>
						<span>Auto</span>
					</button>
				</p>
				<p class="control">
					<button on:click={() => {
						$settings.colourScheme = "dark";
					}} class="button" class:selected={$settings.colourScheme == "dark"}>
						<span class="icon"><Icon data={faMoon} /></span>
						<span>Dark</span>
					</button>
				</p>
			</div>
		</div>

		<!-- Components -->
		<div class="my-2 tab" style="visibility: {(tabs[index] === 'Components') ? 'visible' : 'hidden' }">
			<br>
			<Selector placeholder={"User Components"} selections={$components.map((c) => c.name)} 
				downloadVisible={true} downloadHook={(sel) => {
					let target = $components.filter((c) => c.name === sel)[0];
					storage.downloadFile(target.program, target.filename);
				}}
				deleteVisible={true} deleteHook={(sel) => {
					let target = $components.filter((c) => c.name === sel)[0];
					$components = $components.filter((c) => c.name !== target.name);
				}}
				height="12rem" />
			<br>
			<button on:click={() => {
					storage.uploadFile(components.addComponents, ".plotty.js", true);
				}} class="button mr-2">
				<span class="icon"><Icon data={faFileImport} /></span>
				<span>Upload</span>
			</button>
			<button on:click={() => {
					$modal = { 
						component: Modals.Confirm,
						props: {
							title: "Remove all User Components",
							confirmHook: (() => {
								components.reset();
								$modal = {
									component: Modals.Settings,
									props: {
										index: 1
									}
								};
							}),
							cancelHook: (() => {
								$modal = Modals.Settings;
								$modal = {
									component: Modals.Settings,
									props: {
										index: 1
									}
								};
							})
						}
					};
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
					$modal = { 
						component: Modals.Confirm,
						props: {
							title: "Delete all Logs",
							confirmHook: (() => {
								$modal = {
									component: Modals.Settings,
									props: {
										index: 1
									}
								};
							}),
							cancelHook: (() => {
								$modal = Modals.Settings;
								$modal = {
									component: Modals.Settings,
									props: {
										index: 1
									}
								};
							})
						}
					};
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
			<h3>Current Release: <a href="https://github.com/BOJIT/ploTTY/releases/tag/{env.__GIT_TAG__}" target="_blank">{env.__GIT_TAG__}</a></h3>
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