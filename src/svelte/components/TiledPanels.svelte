<script lang="ts">
	/* Font Awesome */
	import panels from 'src/svelte/store/panels';
	import theme from 'src/svelte/store/theme';
	import { onMount } from 'svelte';
	import { writable } from 'svelte/store';

	/* Keep track of current tab index */
	let currentPanelIdx = 0;

	/* Buffer store to prevent writing a null binding back to the main store */
	const panel_instances = writable([]);
	panel_instances.subscribe((inst) => {
		inst.forEach((p, i) => {
			if(p !== null) {
				panels.update((s) => {
					// TODO bug where instances aren't handled correctly
					s[i].instance = p;
					return s;
				});
			}
		});
	})

	// TODO maybe move to key-based selection
	panels.subscribe((p) => {
		if($panels.length !== 0 && $panels.length <= currentPanelIdx) {
			currentPanelIdx = p.length - 1;
		}
	});

	onMount(() => {
		if($panels.length !== 0 && $panels.length <= currentPanelIdx) {
			currentPanelIdx = $panels.length - 1;
		}
	});
</script>

<main>
	<!-- TODO make panels tileable -->
	<div class="plot-panel">
		{#if $panels.length === 0}
			<div class="plot-no-panels">
				<h2>No Active Panels</h2>
			</div>
		{:else}
			<div class="plot-header">
				<h2>{$panels[currentPanelIdx].title}</h2>
				<div class="plot-tabs">
					{#each $panels as _, idx}
						<button class="button" on:click|preventDefault={() => {
							currentPanelIdx = idx;
						}} class:selected={currentPanelIdx === idx}
						style="background-color: {theme.colourmap($theme, idx)};"></button>
					{/each}
				</div>
			</div>
			{#each $panels as _, idx}
				<div class="plot-content" class:visible={idx === currentPanelIdx} >
					<svelte:component this={$panels[idx].panel}
						bind:this={$panel_instances[idx]}/>
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
