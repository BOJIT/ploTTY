<script lang="ts">
	import type { PanelData } from 'src/svelte/store/panels';

	let q = [];

	export function update(data: PanelData) {
		let s = data.data as string;
		q = [...q, s];
		if(q.length > 10) {
			q.shift();
		}
	};
</script>

<div class="full">
	{#each q as q_e}
		<p>{q_e}</p>
	{/each}
</div>

<style lang="scss">
	@charset "utf-8";
	@use "src/styles/_constants.scss";
	@use "src/styles/theme.scss";

	.full {
		@include theme.themed() {
			background-color: theme.t(theme.$background-primary);
		}

		width: 100%;
		height: 100%;
	}
</style>
