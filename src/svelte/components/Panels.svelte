<script lang="ts">
	/* Font Awesome */
	import Icon from 'svelte-awesome';
	import { faGripHorizontal } from '@fortawesome/free-solid-svg-icons';

	/* Template for Panel Object */
	type panel_t = {
		title: string,
		panel: string // Name of Svelte Panel component
	}

	/* Array of panel objects - see template above for structure */
	let panels : panel_t[];

	/* Keep track of current tab index */
	let currentPanel = 0;
</script>

<main>
	<!-- TODO make panels tileable -->
	<div class="plot-panel">
		<div class="plot-header">
			<span class="icon">
				<Icon data={faGripHorizontal} scale={1.6} />
			</span>
		</div>
		<div class="plot-content">

		</div>
	</div>
</main>

<style lang="scss">
	@charset "utf-8";
	@use "src/scss/_constants.scss";
	@use "src/scss/theme.scss";

	main {
		display: grid;
		height: 100%;
		width: 100%;
		padding: 0.5rem;
		@include theme.themed() {
			background-color: theme.t(theme.$background-secondary);
		}
	}

	.plot-panel {
		align-content: center;
		width: 100%;
		height: 100%;
		border-radius: 0.5rem;
		padding: 0.5rem;
		@include theme.themed() {
			background-color: theme.t(theme.$background-primary);
		}
	}

	.plot-header {
		display: flex;
		padding: 0.25rem;
	}

	.plot-content {
		height: 100%;
		width: 100%;
		background-color: red;
	}
</style>
