<script lang="ts">
	// import modal from './store/modal';
	export let title: string = "Example Modal";

	import { modal } from './store/overlays';

	let active = true; // bodge
	let confirm = true;

	/* Handler to close modal */
	function closeModal() {
		active = false;
		// $modal = null;
	}

	/* Handler to close modal with confirm callback */
	function confirmModal() {
		closeModal();
	}
</script>

<div class="modal modal-animate {active ? 'is-active' : ''}">
	<div class="modal-background"></div>
	<div class="modal-card modal-content">
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

<style>
	.modal {
		display: -webkit-box;
		display: -webkit-flex;
		display: -ms-flexbox;
		display: flex;
		visibility: hidden;
	}

	.modal .modal-background {
		-webkit-transition: all 0.3s;
		-o-transition: all 0.3s;
		transition: all 0.3s;
		opacity: 0;
	}

	.modal.is-active {
		visibility: visible;
	}
	.modal.is-active .modal-background {
		opacity: 1;
	}
	.modal.modal-animate .modal-content {
		-webkit-transform: scale(0.7);
		-o-transform: scale(0.7);
		transform: scale(0.7);
		opacity: 0;
		-webkit-transition: all 0.3s;
		-o-transition: all 0.3s;
		transition: all 0.3s;
	}
	.modal.modal-animate.is-active .modal-content {
		-webkit-transform: scale(1);
		-o-transform: scale(1);
		transform: scale(1);
		opacity: 1;
	}

	.modal .modal-background {
		background-color: rgba(10, 10, 10, 0.86);
	}
</style>
