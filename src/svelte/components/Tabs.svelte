<script lang="ts">
	/* Custom Scrollbar */
	import 'simplebar';
	import 'simplebar/dist/simplebar.css';

	/* Callback for tab click event */
	function handleClick(idx) {
		index = idx;
	}

	/* Array of panel objects - see template above for structure */
	export let tabs : string[];

	/* Keep track of current tab index */
	export let index = 0;
</script>

<div class="tabs mb-0" data-simplebar>
	<ul>
		<!-- Render each tab - updates when the list updates -->
		{#each tabs as tab, idx}
			<li class="{idx === index ? 'is-active' : ''}">
				<a on:click|preventDefault={() => handleClick(idx)} href="{void(0)}">
					{tab}
				</a>
			</li>
		{/each}
	</ul>
</div>

<style lang="scss">
	@charset "utf-8";
	@use "src/styles/_constants.scss";
	@use "src/styles/theme.scss";

	.tabs {
		@include theme.themed() {
			background-color: theme.t(theme.$background-secondary);
		}

		flex: 0 0 auto;
		overflow-x: scroll;
		scrollbar-width: none;
	}

	.tabs::-webkit-scrollbar {
		display: none;
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
