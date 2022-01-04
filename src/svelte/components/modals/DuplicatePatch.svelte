<script lang="ts">
	import Modal from "./Modal.svelte";
	import Input from "src/svelte/components/Input.svelte";

	import settings from "src/svelte/store/settings";
	import patches from "src/svelte/store/patches";

	let patchName: string = "";
	let takenName: boolean = false;
	let invalidName: boolean = false;

	function duplicatePatch(name: string) {
		let idx = $patches.findIndex((p) => p.name === $settings.currentPatch);
		if(idx !== -1) {
			let current_patch = JSON.stringify($patches[idx]);
			let new_patch = JSON.parse(current_patch);
			new_patch.name = name;
			$patches.push(new_patch);
			$settings.currentPatch = name;
		} else {
			console.error("No matching key found!");
		}
	}
</script>

<Modal title="Duplicate Patch" confirmHook={() => duplicatePatch(patchName)}
	disabled={ takenName || invalidName || patchName === ""}>
<h3>New Patch Name</h3>
<Input placeholder ={"Duplicate Patch Name"} blacklist={$patches.map((p) => p.name)}
bind:input={patchName} bind:isBlacklisted={takenName} bind:isInvalid={invalidName} />
{#if takenName }
<p class="invalid">Patch name already taken!</p>
{/if}
{#if invalidName }
<p class="invalid">Patch name is invalid!</p>
{/if}
</Modal>

<style lang="scss">
	@charset "utf-8";
	@use "src/styles/_constants.scss";
	@use "src/styles/theme.scss";

	p.invalid {
		@include theme.themed() {
			color: theme.t(theme.$background-error) !important;
		}
		margin-top: 0.5rem;
	}
</style>
