<script lang="ts">
	/* Font Awesome */
	import Icon from 'svelte-awesome';
	import { faGripHorizontal } from '@fortawesome/free-solid-svg-icons';

	import panels from './panels';
	import theme from 'src/svelte/store/theme';

	/* Template for Panel Object */
	type panel_t = {
		title: string,
		panel: string // Name of Svelte Panel component
	}

	/* Array of panel objects - see template above for structure */
	export let currentPanels : panel_t[];

	/* Keep track of current tab index */
	let currentPanelIdx = 0;
</script>

<main>
	<!-- TODO make panels tileable -->
	<div class="plot-panel">
		<div class="plot-header">
			<button class="button">
				<span class="icon">
					<Icon data={faGripHorizontal} scale={1.2} />
				</span>
			</button>
			<h2>{currentPanels[currentPanelIdx].title}</h2>
			<div class="plot-tabs">
				{#each currentPanels as panel, idx}
					<button class="button" on:click|preventDefault={() => {
						currentPanelIdx = idx;
					}} class:selected={currentPanelIdx === idx}
					style="background-color: {theme.colourmap($theme, idx)};"></button>
				{/each}
			</div>
		</div>
		<div class="plot-content">
			<svelte:component this={panels[currentPanels[currentPanelIdx].panel]} />
		</div>
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
		background-color: red;
	}

	.plot-header > .button {
		height: 1rem;
		width: 1rem;
		padding: 0rem;
		background: none;
		border: none;
		pointer-events: none;
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
</style>