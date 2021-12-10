<script lang="ts">
	import { fade, fly } from 'svelte/transition';
	import { flip } from 'svelte/animate';
	import { popup } from "src/svelte/store/overlays"

	import Icon from 'svelte-awesome';
	import { faInfo, faExclamationTriangle, faTimesCircle } from '@fortawesome/free-solid-svg-icons';
</script>

<div class="container">
	{#each $popup as entry (entry.uid)}
		<div in:fly="{{ x:-500, delay: 300 }}" out:fade animate:flip
				class="popup notification"
				class:is-info="{entry.type === "info"}"
				class:is-warning="{entry.type === "warning"}"
				class:is-danger="{entry.type === "error"}">
			<button on:click={() => popup.close(entry.uid)} class="delete"></button>
			<span class="icon popup-icon">
				<div>
					{#if entry.type === "info"}
						<Icon data={faInfo} scale={1.4} />
					{:else if entry.type === "warning"}
						<Icon data={faExclamationTriangle} scale={1.4} />
					{:else if entry.type === "error"}
						<Icon data={faTimesCircle} scale={1.4} />
					{/if}
				</div>
			</span>
			<div class="popup-message">
				<h1>{entry.title}</h1>
				<p>{entry.message}</p>
			</div>
		</div>
	{/each}
</div>

<style lang="scss">
	@charset "utf-8";
	@use "src/scss/_constants.scss";

	.container {
		position: fixed;
		height: 8em;    /* TODO make dependent on message height + a bit */
		width: 30em;
		bottom: 0;
		left: 0;
		pointer-events: none;
		padding: 0.5rem;
		}

	@media screen and (max-width: (constants.$desktop - 1)) {
		.container {
			width: 100%;
		}
	}

	.popup {
		width: 100%;
		margin-bottom: 0.5rem !important;
		display: flex;
		pointer-events: auto;
	}

	.popup-icon {
		flex: 0 0 auto;
		position: relative;
		margin-right: 1rem;
	}

	.popup-icon > div {
		position: absolute;
		top: 50%;
	}

	.popup-message {
		flex: 1 0 auto;
	}
</style>
