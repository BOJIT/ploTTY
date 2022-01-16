<script lang="ts">
	import { onMount } from 'svelte';
	import { Component, Graph } from "noflo";

	import library from "src/svelte/store/library";
	import Input from "src/svelte/components/Input.svelte";
	import JSONEditor from "src/svelte/components/JSONEditor.svelte";
	import Modal from "./Modal.svelte";

	import Icon from 'svelte-awesome';
	import { faArrowCircleRight, faCaretSquareDown, faCode, faUndo } from '@fortawesome/free-solid-svg-icons';

	export let graph: Graph;
	export let selected: string;

	type portSetting = {
		name: string,
		mode: 'thru' | 'enum' | 'constant',
		constant: string,
		enum?: [],
		enumIdx?: number
	}

	let portSettings: portSetting[] = [];

	function getComponentDefaults() {
		let settings = [];
		let c = $library[graph.getNode(selected).component].getComponent(Component);
		for (const [key, port] of Object.entries(c.inPorts.ports) as any) {
			/* Check if fields exist in component */
			let constant: string = "{}";
			if("default" in port.options) {
				constant = JSON.stringify(port.options.default);
			}

			let p: portSetting = {
				name: key,
				mode: 'thru',
				constant: constant
			};

			if("enum" in port.options) {
				if(typeof port.options.enum === 'function') {
					p.enum = port.options.enum();
				} else {
					p.enum = port.options.enum;
				}
				p.enumIdx = 0;
			}

			settings = [...settings, p];
		}
		return settings;
	}

	function settingChanged() {
		// Write component metadata back to graph
		let m = graph.getNode(selected).metadata;
		m.portSettings = portSettings;
		graph.setNodeMetadata(selected, m);

		// Set initial packets in graph
		portSettings.forEach((p) => {
			graph.removeInitial(selected, p.name);
			switch (p.mode) {
				case 'thru':
					// No initial packet
					break;
				case 'enum':
					if('enum' in p) {
						graph.addInitial(p.enum[p.enumIdx], selected, p.name);
					}
					break;
				case 'constant':
					try {
						let constant = JSON.parse(p.constant);
						graph.addInitial(constant, selected, p.name);
					} catch (error) {
						// Simply don't update initial if invalid
						graph.removeInitial(selected, p.name);
					}
					break;
			}
		});
	}

	onMount(() => {
		// Try to load existing metadata - if not load default component metadata
		let n = graph.getNode(selected);
		if("portSettings" in n.metadata) {
			portSettings = n.metadata.portSettings;
		} else {
			portSettings = getComponentDefaults();
		}
	});
</script>

<Modal title="Component Settings" confirm={false}>
	<h3>Component Name</h3>
	<Input placeholder ={"Label"} />
	<br>

	{#each portSettings as p, i }
		<!-- Mode Row -->
		<div class="selection button">
			<button class="button is-left">
				<h3>{p.name}</h3>
			</button>
			<button on:click={() => {
					portSettings[i].mode = 'thru';
					settingChanged();
				}} class="button thru btn-group" class:selected={p.mode === 'thru'}>
				<span class="icon"><Icon data={faArrowCircleRight} /></span>
			</button>
			<button on:click={() => {
					portSettings[i].mode = 'enum';
					settingChanged();
				}} class="button enum btn-group" class:selected={p.mode === 'enum'}>
				<span class="icon"><Icon data={faCaretSquareDown} /></span>
			</button>
			<button on:click={() => {
					portSettings[i].mode = 'constant';
					settingChanged();
				}} class="button constant btn-group" class:selected={p.mode === 'constant'}>
				<span class="icon"><Icon data={faCode} /></span>
			</button>
		</div>

		<!-- Thru Menu (separator) -->
		{#if p.mode === 'thru'}
			<div style="padding-top: 0.5rem"/>
		{/if}

		<!-- Enum Menu -->
		{#if p.mode === 'enum'}
			<div class="enum-container">
				{#if "enum" in p}
					{#each p.enum as e, j}
						<div class="enum-entry" on:click={() => {
							portSettings[i].enumIdx = j;
							settingChanged();
						}} class:enum-selected={j === p.enumIdx}>
							<p>{JSON.stringify(e)}</p>
						</div>
					{/each}
				{:else}
					<div class="enum-entry" style="pointer-events: none">
						<p>No Enum Available</p>
					</div>
				{/if}
			</div>
		{/if}

		<!-- Code Editor -->
		{#if p.mode === 'constant'}
			<div>
				<JSONEditor bind:code={portSettings[i].constant}/>
			</div>
		{/if}
	{/each}

	<br>
	<button on:click={() => {
			portSettings = getComponentDefaults();
			settingChanged();
		}} class="button mr-2 is-danger">
		<span class="icon"><Icon data={faUndo} /></span>
		<span>Restore Default Values</span>
	</button>
</Modal>

<style lang="scss">
	@charset "utf-8";
	@use "src/styles/_constants.scss";
	@use "src/styles/theme.scss";

	.selection {
		width: 100%;
		border-radius: 0px;
		padding: 0px;
	}

	.selection > button {
		flex: 0 0 auto;
		height: 100%;
		display: flex;
		align-items: center;
		border: none;
	}

	.selection > button.is-left {
		justify-content: left;
		text-align: left;
	}

	.selection > button:first-child {
		flex-grow: 1;
	}

	.selection > button {
		border-radius: 0px;
		pointer-events: none;
	}

	.selection > .btn-group:not(.selected) {
		pointer-events: auto;
	}

	.selection > .btn-group:not(.selected):not(:hover) {
		@include theme.themed() {
			filter: brightness(theme.t(theme.$filter-inactive)) saturate(30%);
		}
	}

	.selection > .button.thru {
		@include theme.themed() {
			background-color: theme.t(theme.$background-info);
		}
	}

	.selection > .button.enum {
		@include theme.themed() {
			background-color: theme.t(theme.$background-success);
		}
	}

	.selection > .button.constant {
		@include theme.themed() {
			background-color: theme.t(theme.$background-warning);
		}
	}

	.enum-container {
		padding-top: 0.5rem;
		padding-bottom: 0.5rem;
	}

	.enum-entry {
		padding-top: 0.2rem;
		padding-bottom: 0.2rem;
		text-align: center;
		width: 100%;
		@include theme.themed() {
			background-color: theme.t(theme.$background-primary);
		}
	}

	.enum-entry.enum-selected {
		@include theme.themed() {
			background-color: desaturate(theme.t(theme.$background-success), 40%);
		}
	}

	.enum-entry.enum-selected p {
		@include theme.themed() {
			color: theme.t(theme.$text-primary);
		}
	}

	.enum-entry:not(.enum-selected):hover {
		@include theme.themed() {
			background-color: theme.t(theme.$background-overlay-hover);
		}
	}

</style>
