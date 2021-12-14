<script lang="ts">
	/* Font Awesome */
	import Icon from 'svelte-awesome';
	import { fly } from 'svelte/transition';

	import { faPlay, faStop, faEdit, faFileAlt, faFolderOpen, faSave, faCopy, faCog, faBars} from '@fortawesome/free-solid-svg-icons';

	/* Images */
	import imgBojitLogo from 'src/assets/img/bojit_logo_square.png';

	/* Overlays */
	import { modal, popup } from 'src/svelte/store/overlays';
	import Modals from './modals';

	/* Editor state */
	import editor from 'src/svelte/store/editor';

	/* TODO - put theme toggle in settings loader */
	import theme from 'src/svelte/store/theme';

	/* Burger Menu */
	let visible = false;

	/* Function to detect a click outside the burger menu */
	function clickOutside(node: Node) {
		const handleClick = (event: Event) => {
			if (!node.contains(event.target as Node)) {
				visible = false;
			}
		};

		document.addEventListener("click", handleClick, true);

		return {
			destroy() {
				document.removeEventListener("click", handleClick, true);
			}
		};
	}

	let patchRunning = false;
</script>

<!-- Navbar -->
<div class="nav is-primary" role="navigation" aria-label="main navigation">
	<!-- Navbar Left-Hand Side -->
	<div class="nav-left" style="margin-top: 6px">
		<a href="https://bojit.org/" target="_blank">
			<img src="{imgBojitLogo}" alt="BOJIT logo" style="max-height:3.5rem">
		</a>
	</div>

	<div class="nav-left">
		<h1>ploTTY</h1>
	</div>

	<!-- Navbar Right-Hand Side -->
	<div class="nav-right">

		<!-- Runtime Controls -->
		<button on:click={() => {
				popup.push({
					"title": "Going...",
					"message": "Hey there...",
					"type": "info",
					"timeout": 5
				});
				patchRunning = !patchRunning;
			}} class="button is-medium {patchRunning ? 'is-danger' : 'is-success'}">
			<span class="icon">
				<Icon data={patchRunning ? faStop : faPlay} scale={1.6} />
			</span>
		</button>

		<button on:click={() => {
				if($editor.visible) {
					editor.hide();
				} else {
					editor.show();
				}
			}} class="button is-medium {$editor.visible ? 'is-warning' : 'is-info'}">
			<span class="icon">
				<Icon data={faEdit} scale={1.6} />
			</span>
		</button>

		<div class="divider desktop"><hr></div>

		<!-- File Controls -->
		<button on:click={() => {
				if($theme.mode === "dark") {
					$theme.mode = "light";
				} else {
					$theme.mode = "dark";
				}
			}} class="button desktop is-medium is-clear">
			<span class="icon">
				<Icon data={faFileAlt} scale={1.6} />
			</span>
		</button>

		<button on:click={() => {
				$modal = Modals.OpenPatch;
			}} class="button desktop is-medium is-clear">
			<span class="icon">
				<Icon data={faFolderOpen} scale={1.6} />
			</span>
		</button>

		<button on:click={() => {
				$modal = Modals.SavePatch;
			}} class="button desktop is-medium is-clear">
			<span class="icon">
				<Icon data={faSave} scale={1.6} />
			</span>
		</button>

		<button on:click={() => {
				$modal = Modals.DuplicatePatch;
			}} class="button desktop is-medium is-clear">
			<span class="icon">
				<Icon data={faCopy} scale={1.6} />
			</span>
		</button>

		<div class="divider"><hr></div>

		<!-- Settings -->
		<button on:click={() => {
				$modal = Modals.Settings;
			}} class="button desktop is-medium is-clear">
			<span class="icon">
				<Icon data={faCog} scale={1.6} />
			</span>
		</button>

		<!-- Burger Menu -->
		<button on:click={() => {
				visible = true;
			}} class="button mobile is-medium is-clear"
			style="pointer-events: {visible ? 'none' : 'auto'}">
			<span class="icon">
				<Icon data={faBars} scale={1.6} />
			</span>
		</button>
	</div>
</div>

<!-- Burger Menu -->
{#if visible }
	<div class="burger-container">
		<div transition:fly="{{ y:-100 }}" use:clickOutside class="burger">
			<button on:click={() => {
					$modal = Modals.NewPatch;
					visible = false;
				}} class="button burger-entry">
				<h1>New Patch</h1>
			</button>
			<hr>
			<button on:click={() => {
					$modal = Modals.OpenPatch;
					visible = false;
				}} class="button burger-entry">
				<h1>Open Patch</h1>
			</button>
			<hr>
			<button on:click={() => {
					$modal = Modals.SavePatch;
					visible = false;
				}} class="button burger-entry">
				<h1>Save Patch</h1>
			</button>
			<hr>
			<button on:click={() => {
					$modal = Modals.DuplicatePatch;
					visible = false;
				}} class="button burger-entry">
				<h1>Duplicate Patch</h1>
			</button>
			<hr>
			<button on:click={() => {
					$modal = Modals.Settings;
					visible = false;
				}} class="button burger-entry">
				<h1>Settings</h1>
			</button>
		</div>
	</div>
{/if}

<style lang="scss">
	@charset "utf-8";
	@use "src/scss/_constants.scss";
	@use "src/scss/theme.scss";

	.divider {
		width: 1px;
		display: flex;
		margin-left: 4px;
		margin-right: 4px;
		margin-top: 0px;
		margin-bottom: 0px;
		@include theme.themed() {
			background-color: theme.t(theme.$text-primary);
		}

		hr {
			@include theme.themed() {
				background-color: theme.t(theme.$text-primary);
			}
		}
	}

	/* Navbar Styling */
	.nav {
		flex: 0 0 auto;
		display: flex;
		justify-content: flex-end;
		align-items: center;
		width: 100%;
		@include theme.themed() {
			background-color: theme.t(theme.$background-primary);
		}
		z-index: 20;
	}

	.nav-left {
		flex: 0 0 auto;
		margin-left: 4px;
		margin-right: 4px;
	}

	.nav-right {
		display: flex;
		width: auto;
		justify-content: flex-end;
		align-items: center;
		flex: 1 0 auto;
		padding-right: 4px;
	}

	.nav h1 {
		font-size: 2rem;
		font-weight: 50;
		font-family: "comfortaa";
		@include theme.themed() {
			color: theme.t(theme.$text-primary);
		}
	}

	.nav .button {
		margin: 4px;
	}

	/* Burger Menu Styling */
	.burger-container {
		position: relative;
	}

	.burger {
		width: 100%;
		@include theme.themed() {
			background-color: theme.t(theme.$background-overlay);
		}
		position: absolute;
		z-index: 10;
	}

	.burger > hr {
		margin: 1px;
		height: 1px;
	}

	.burger h1 {
		font-size: 1.5rem;
		font-weight: 20;
		font-family: "comfortaa";
		@include theme.themed() {
			color: theme.t(theme.$text-primary);
		}
	}

	.burger .button {
		width: 100%;
		border: none;
		background: none;
		margin-top: 5px;
		margin-bottom: 5px;
	}

	/* Button Styling */
	.button:focus {
		outline: none;
		box-shadow: none;
	}

	.is-info {
		@include theme.themed() {
			background-color: theme.t(theme.$background-info);
		}
	}

	.is-success {
		@include theme.themed() {
			background-color: theme.t(theme.$background-success);
		}
	}

	.is-warning {
		@include theme.themed() {
			background-color: theme.t(theme.$background-warning);
		}
	}

	.is-danger {
		@include theme.themed() {
			background-color: theme.t(theme.$background-error);
		}
	}

	.is-clear {
		color: whitesmoke;
		background-color: transparent;
		border: none;
	}

	.is-clear:hover {
		background-color: rgba(83, 83, 83, 0.5);
	}

	.icon {
		@include theme.themed() {
			color: theme.t(theme.$text-primary);
		}
	}

	/* Mobile/Desktop Display Overflow */
	.mobile {
		display: none;
	}

	.desktop {
		display: block;
	}

	@media screen and (max-width: (constants.$desktop - 1)) {
		.mobile {
			display: block !important;
		}

		.desktop {
			display: none !important;
		}
	}
</style>
