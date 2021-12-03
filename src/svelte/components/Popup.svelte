<script lang="ts">
	import { fly } from 'svelte/transition';
	import { flip } from 'svelte/animate';
	import { popup } from "src/svelte/store/overlays"
</script>

<div class="container">
	{#each $popup as entry (entry.uid)}
		<div transition:fly="{{ x:-500, delay: 300 }}" animate:flip
				class="popup box"
				class:popup-info="{entry.type === "info"}"
				class:popup-warning="{entry.type === "warning"}"
				class:popup-error="{entry.type === "error"}">
			<h1>{entry.title}</h1>
			<p>{entry.message}</p>
		</div>
	{/each}
</div>

<style lang="scss">
	@charset "utf-8";
	@import "src/constants.scss";

	.container {
		position: fixed;
		height: 8em;    /* TODO make dependent on message height + a bit */
		width: 30em;
		bottom: 0;
		left: 0;
		pointer-events: none;
		padding: 0.5rem;
		}

	@media screen and (max-width: ($desktop - 1)) {
		.container {
			width: 100%;
		}
	}

	.popup {
		width: 100%;
		margin-bottom: 0.5rem !important;
	}

	.popup-info {
		background-color: hsl(204, 86%, 53%);
	}

	.popup-warning {
		background-color: hsl(48, 100%, 67%);
	}

	.popup-error {
		background-color: hsl(348, 100%, 61%);
	}
</style>
