<script lang="ts">
	import modal from './store/modal';
import Tabs from './Tabs.svelte';

	/* Handler to close modal */
	function closeModal() {
		modal.hideModal();
	}

	/* Handler to close modal with confirm callback */
	function confirmModal() {
		$modal.confirm();	// TODO: handle greying out confirm + invalid selection
		modal.hideModal();
	}

	/**
	 * @brief Render modal content in object format into readable HTML
	 * @param content
	 * @returns
	 */
	function renderContent(content: object) {
		console.log(content);
		return <Tabs>;
	}

</script>

<div class="modal modal-animate {$modal.active ? 'is-active' : ''}">
	<div class="modal-background"></div>
	<div class="modal-card modal-content">
		<header class="modal-card-head">
			<p class="modal-card-title">{$modal.title}</p>
			<button on:click={closeModal} class="delete"></button>
		</header>
		<section class="modal-card-body">
			<h2>
				{#if $modal.content != undefined}
					{renderContent($modal.content)}
				{/if}
			</h2>
		</section>
		<footer class="modal-card-foot">
			{#if $modal.confirm != false}
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
