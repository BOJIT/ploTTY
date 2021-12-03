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
