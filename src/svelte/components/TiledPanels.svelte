<script lang="ts">
	/* Font Awesome */
	import panels from 'src/svelte/store/panels';
	import theme from 'src/svelte/store/theme';
	import { writable } from 'svelte/store';

	/* Keep track of current tab */
	let currentPanel = "";

	/* Buffer store to prevent writing a null binding back to the main store */
	const panel_instances = writable({});
	panel_instances.subscribe((inst) => {
		for(const [id, p] of Object.entries(inst)) {
			if(p !== null) {
				$panels[id].instance = p;
			}
		}
	})

	panels.subscribe((p) => {
		/* For now just reset to first key when change occurs */
		currentPanel = Object.keys(p)[0];
		panel_instances.set({});
	});
</script>

<main>
	<!-- TODO make panels tileable -->
	<div class="plot-panel">
		{#if $panels[currentPanel] === undefined}
			<div class="plot-no-panels">
				<h2>No Active Panels</h2>
			</div>
		{:else}
			<div class="plot-header">
				<h2>{$panels[currentPanel].title}</h2>
				<div class="plot-tabs">
					{#each Object.entries($panels) as [id], idx}
						<button class="button" on:click|preventDefault={() => {
							currentPanel = id;
						}} class:selected={currentPanel === id}
						style="background-color: {theme.colourmap($theme, idx)};"></button>
					{/each}
				</div>
			</div>
			{#each Object.entries($panels) as [id, panel]}
				<div class="plot-content" class:visible={currentPanel === id} >
					<svelte:component this={panel.panel}
						bind:this={$panel_instances[id]}/>
				</div>
			{/each}
		{/if}
	</div>
</main>

<style lang="scss">
	@charset "utf-8";
	@use "src/styles/_constants.scss";
	@use "src/styles/theme.scss";

	main {
		display: grid;
		height: 100%;
		width: 100%;
		padding: 0.5rem;
		@include theme.themed() {
			background-color: theme.t(theme.$background-secondary);
		}
	}

	h2 {
		@include theme.themed() {
			color: theme.t(theme.$text-primary);
		}
		font-size: 1rem;
	}

	.plot-panel {
		align-content: center;
		display: flex;
		flex-direction: column;
		width: 100%;
		height: 100%;
		border-radius: 0.5rem;
		padding: 0.5rem;
		@include theme.themed() {
			background-color: theme.t(theme.$background-primary);
		}
	}

	.plot-no-panels {
		width: 100%;
		height: 100%;
		display: flex;
		align-items: center;
		justify-content: center;
	}

	.plot-no-panels h2 {
		font-size: 4rem;
		@include theme.themed() {
			color: theme.t(theme.$text-secondary);
		}
	}

	.plot-header {
		flex: 1 0 auto;
		display: flex;
		gap: 1rem;
		align-items: flex-start;
		padding: 0.25rem;
	}

	.plot-tabs {
		flex: 1 0 auto;
		display: flex;
		flex-direction: row-reverse;
		gap: 0.5rem;
	}

	.plot-content {
		height: 100%;
		width: 100%;
		display: none;
	}

	.plot-tabs > .button {
		border-radius: 50%;
		height: 1rem;
		width: 1rem;
		padding: 0rem;
		border: none;
	}

	.plot-tabs > .button:not(:hover) {
		filter: saturate(40%);
	}

	.selected {
		filter: saturate(100%) !important;
	}

	.button:focus {
		outline: none;
		box-shadow: none;
	}

	.visible {
		display: block;
	}
</style>
