<script lang="ts">
	import Icon from 'svelte-awesome';
	import { faTimes, faSearch } from '@fortawesome/free-solid-svg-icons';

	export let placeholder: string = "Placeholder";
	export let selections: string[];

	/* Searchbox Filtering */
	let search = "";
	function searchSelections(current: string, filter: string) {
		console.log("Changed");
		return true;
	}
</script>

<div class="field mb-0">
	<p class="control has-icons-left has-icons-right">
		<input bind:value={search} class="input" placeholder="{placeholder}">
		<span class="icon is-small is-left">
			<Icon data={faSearch} />
		</span>
		<span class="icon is-small is-right">
			<Icon data={faTimes} />
		</span>
	</p>
</div>
<div class="selector">
	{#each selections as selection}
		{#if searchSelections(selection, search)}
			<button class="selection button">
				<h3>{selection}</h3>
			</button>
		{/if}
	{/each}
</div>

<style lang="scss">
	@charset "utf-8";
	@use "src/styles/_constants.scss";
	@use "src/styles/theme.scss";

	.selector {
		max-height: 7rem;
		overflow-y: scroll;
	}

	.selection {
		width: 100%;
		border-radius: 0px;
	}

	.input {
		border-radius: 0px;
	}
</style>
