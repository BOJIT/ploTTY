<script lang="ts">
	/* Universal Modal Parameters */
	export let title: string = "Example Modal";
	export let confirm: boolean = true;

	import { modal } from 'src/svelte/store/overlays';
	import { fade, scale } from 'svelte/transition';

	/* Handler to close modal */
	function closeModal() {
		$modal = null;
	}

	/* Handler to close modal with confirm callback */
	function confirmModal() {
		closeModal();
	}
</script>

<div class="modal is-active">
	<div transition:fade="{{ duration: 250 }}" class="modal-background"></div>
	<div transition:scale="{{ duration: 250 }}" class="modal-card modal-content">
		<header class="modal-card-head">
			<p class="modal-card-title">{title}</p>
			<button on:click={closeModal} class="delete"></button>
		</header>
		<section class="modal-card-body">
			<slot></slot>
		</section>
		<footer class="modal-card-foot">
			{#if confirm != false}
				<button on:click={confirmModal} class="button is-success">Confirm</button>
				<button on:click={closeModal} class="button">Cancel</button>
			{/if}
		</footer>
	</div>
</div>

<style lang="scss">
	@charset "utf-8";
	@use "src/scss/_constants.scss";
	@use "src/scss/theme.scss";

	.modal-card {
		margin: 5px;
	}

	@media screen and (max-width: (constants.$desktop - 1)) {
		.modal-card.modal-content {
			width: calc(100% - 40px);
			height: 100%;
		}
	}

	.modal-card-head {
		@include theme.themed() {
			background-color: theme.t(theme.$background-primary);
		}
	}

	.modal-card-body {
		@include theme.themed() {
			background-color: theme.t(theme.$background-secondary);
		}
	}

	.modal-card-foot {
		@include theme.themed() {
			background-color: theme.t(theme.$background-primary);
		}
	}

	.modal-card-title {
		@include theme.themed() {
			color: theme.t(theme.$text-primary);
		}
	}

	.modal-card-body :global(h2) {
		@include theme.themed() {
			color: theme.t(theme.$text-primary);
		}
	}

	.modal-card-body :global(p) {
		@include theme.themed() {
			color: theme.t(theme.$text-secondary);
		}
	}

	button {
		@include theme.themed() {
			color: theme.t(theme.$text-primary);
			background-color: theme.t(theme.$background-secondary);
		}
	}

	button.is-success {
		@include theme.themed() {
			background-color: theme.t(theme.$background-success);
		}
	}
</style>
