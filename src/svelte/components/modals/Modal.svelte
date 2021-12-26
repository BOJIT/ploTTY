<script lang="ts">
	/* Universal Modal Parameters */
	export let title: string = "Example Modal";
	export let confirm: boolean = true;
	export let disabled: boolean = false;

	export let confirmHook: (() => void) = (() => {});
	export let cancelHook: (() => void) = (() => {});

	/* Custom Scrollbar */
	import 'simplebar';
	import 'simplebar/dist/simplebar.css';

	import { modal } from 'src/svelte/store/overlays';
	import { fade, scale } from 'svelte/transition';

	/* Handler to close modal */
	function cancelModal() {
		$modal = null;
		cancelHook();
	}

	/* Handler to close modal with confirm callback */
	function confirmModal() {
		$modal = null;
		confirmHook();
	}
</script>

<div class="modal is-active">
	<div transition:fade="{{ duration: 250 }}" class="modal-background"></div>
	<div transition:scale="{{ duration: 250 }}" class="modal-card modal-content">
		<header class="modal-card-head">
			<p class="modal-card-title">{title}</p>
			<button on:click={cancelModal} class="delete"></button>
		</header>
		<section class="modal-card-body" data-simplebar>
			<slot></slot>
		</section>
		<footer class="modal-card-foot">
			{#if confirm != false}
				<button on:click={confirmModal} class="button is-success" disabled={disabled}>Confirm</button>
				<button on:click={cancelModal} class="button">Cancel</button>
			{/if}
		</footer>
	</div>
</div>

<style lang="scss">
	@charset "utf-8";
	@use "src/styles/_constants.scss";
	@use "src/styles/theme.scss";

	.modal {
		z-index: 30;
	}

	.modal-card {
		padding: 20px;
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
		overflow-y: scroll;
		scrollbar-width: none;
	}

	.modal-card-body::-webkit-scrollbar {
		display: none;
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

	.modal-card-body :global(h3) {
		@include theme.themed() {
			color: theme.t(theme.$text-primary);
		}
	}

	.modal-card-body :global(p) {
		@include theme.themed() {
			color: theme.t(theme.$text-secondary);
		}
	}

	.modal-card-body :global(hr) {
		@include theme.themed() {
			background-color: theme.t(theme.$text-primary);
		}
		height: 0.5px;
		border: none;
		margin-top: 0.6rem;
		margin-bottom: 0.6rem;
	}

	.modal-card-body :global(br) {
		line-height: 0.5rem;
	}

	.modal-card-body :global(.button) {
		@include theme.themed() {
			color: theme.t(theme.$text-primary);
			background-color: theme.t(theme.$background-secondary);
			border-color: theme.t(theme.$text-primary);
		}
	}

	.modal-card-body :global(.button.is-info) {
		@include theme.themed() {
			background-color: theme.t(theme.$background-info);
		}
	}

	.modal-card-body :global(.button.is-success) {
		@include theme.themed() {
			background-color: theme.t(theme.$background-success);
		}
	}

	.modal-card-body :global(.button.is-warning) {
		@include theme.themed() {
			background-color: theme.t(theme.$background-warning);
		}
	}

	.modal-card-body :global(.button.is-danger) {
		@include theme.themed() {
			background-color: theme.t(theme.$background-error);
		}
	}

	.modal-card-body :global(.button):focus {
		outline: none;
		box-shadow: none;
	}

	.modal-card-body :global(.button.selected) {
		@include theme.themed() {
			color: theme.t(theme.$background-secondary);
			background-color: theme.t(theme.$text-primary);
		}
	}
</style>
