<script lang="ts">
	/* Font Awesome */
	import Icon from 'svelte-awesome';
	import { faTimes, faFile } from '@fortawesome/free-solid-svg-icons';

	/* External Props */
	export let placeholder: string = "Placeholder";
	export let blacklist: string[] = [];
	export let isBlacklisted: boolean = false;
	export let isInvalid: boolean = false;
	export let input = "";

	function invalidString(txt) { 
		var format = /[`!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~]/;
		if (format.test(txt)) {
			return true;
		} else {
			return false;
		}
	}

	function inputChange() {
		/* Test if invalid */
		if(invalidString(input)) {
			isInvalid = true;
		} else {
			isInvalid = false;
		}
		/* Test if blacklisted */
		if(blacklist.filter(s => s.toLowerCase() == (input.toLowerCase())).length) {
			isBlacklisted = true;
		} else {
			isBlacklisted = false;
		}
	}

	function clearInput() {
		input = "";
		inputChange();	// Is not automatically called
	}
</script>

<div class="field mb-0">
	<p class="control has-icons-left has-icons-right">
		<input bind:value={input} on:input={inputChange}
			class:is-danger={isInvalid || isBlacklisted} class="input" placeholder="{placeholder}">
		<span class="icon is-small is-left">
			<Icon data={faFile} />
		</span>
		<span on:click={clearInput} class="icon is-small is-right">
			<Icon data={faTimes} />
		</span>
	</p>
</div>

<style lang="scss">
	@charset "utf-8";
	@use "src/styles/_constants.scss";
	@use "src/styles/theme.scss";

	.field {
		margin-top: 0.5rem;
		margin-bottom: 0.5rem;
	}

	.input {
		border-radius: 0px;
		@include theme.themed() {
			background-color: theme.t(theme.$background-primary);
			color: theme.t(theme.$text-secondary);
		}
	}

	.input::placeholder {
		@include theme.themed() {
			color: theme.t(theme.$background-overlay-hover);
		}
	}

	.icon {
		@include theme.themed() {
			color: theme.t(theme.$text-secondary);
		}
	}

	.input:focus {
		@include theme.themed() {
			color: theme.t(theme.$text-primary);
		}
	}
	
	.input.is-danger {
		@include theme.themed() {
			color: theme.t(theme.$background-error);
		}
	}
	
	.input:focus ~ .icon {
		@include theme.themed() {
			color: theme.t(theme.$text-primary);
		}
	}

	.icon.is-right {
		pointer-events: auto !important;
	}

	.icon.is-right:hover {
		@include theme.themed() {
			color: theme.t(theme.$background-overlay-hover);
		}
	}
</style>
