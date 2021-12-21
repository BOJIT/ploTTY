<script lang="ts">
	/* Callback for tab click event */
	function handleClick(idx) {
		currentTabIdx = idx;
	}

	/* Template for Panel Object */
	type tab_t = {
		title: string,
		panel: any	//this should really be a Svelte component (TS linter error)
	}

	/* Array of panel objects - see template above for structure */
	export let tabs : tab_t[];

	/* Keep track of current tab index */
	let currentTabIdx = 0;
</script>

<div class="tabs mb-0">
	<ul>
		<!-- Render each tab - updates when the list updates -->
		{#each tabs as tab, idx}
			<li class="{idx === currentTabIdx ? 'is-active' : ''}">
				<a on:click|preventDefault={() => handleClick(idx)} href="{void(0)}">
					{tab.title}
				</a>
			</li>
		{/each}
	</ul>
</div>

<div class="container">
	<!-- Render main window as the selected Svelte component -->
	{#each tabs as tab, idx}
		<div style="display: {idx === currentTabIdx ? 'block' : 'none'}">
			<svelte:component this={tab.panel} />
		</div>
	{/each}
	</div>

<style lang="scss">
	@charset "utf-8";
	@use "src/scss/_constants.scss";
	@use "src/scss/theme.scss";

	.container {
		flex: 1 1 auto;
		position: relative;
	}

	.container > div {
		height: 100%;
		width: 100%;
	}

	.tabs {
		@include theme.themed() {
			background-color: theme.t(theme.$background-secondary);
		}

		flex: 0 0 auto;
	}

	a {
		@include theme.themed() {
			color: theme.t(theme.$text-secondary);
		}
	}

	li.is-active a {
		color: hsl(229,52%,52%);
	}

</style>
