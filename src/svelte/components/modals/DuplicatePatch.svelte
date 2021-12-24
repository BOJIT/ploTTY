<script lang="ts">
	import Modal from "./Modal.svelte";
	import Input from "src/svelte/components/Input.svelte";

	let invalidFileName: boolean;
</script>

<Modal title="Duplicate Patch">
	<h3>Duplicate File Name</h3>
	<Input placeholder ={"Duplicate File Name"} 
		blacklist={["Test", "N/A"]} bind:isInvalid={invalidFileName} />
	{#if invalidFileName}
		<p class="invalid">File name invalid/already taken!</p>
	{/if}
</Modal>

<style lang="scss">
	@charset "utf-8";
	@use "src/styles/_constants.scss";
	@use "src/styles/theme.scss";

	p.invalid {
		@include theme.themed() {
			color: theme.t(theme.$background-error);
		}
		margin-top: 0.5rem;
	}
</style>
