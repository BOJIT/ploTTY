<script lang="ts">
	/* Font Awesome */
	import Icon from 'svelte-awesome';
	import { faPlay, faStop, faFileAlt, faFolderOpen, faSave, faCopy, faCog, faBars } from '@fortawesome/free-solid-svg-icons';

	/* Images */
	import imgBojitLogo from 'src/assets/img/bojit_logo_square.png';

	/* Overlays */
	import { modal, popup } from 'src/svelte/store/overlays';
	import Modals from './modals';
</script>

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
			}} class="button is-success is-medium">
			<span class="icon">
				<Icon data={faPlay} scale={1.6} />
			</span>
		</button>

		<button on:click={() => {
				popup.push({
					"title": "STOP!",
					"message": "stop pressed!",
					"type": "error"
				});
			}} class="button is-danger is-medium">
			<span class="icon">
				<Icon data={faStop} scale={1.6} />
			</span>
		</button>

		<div class="divider desktop"><hr></div>

		<!-- File Controls -->
		<button on:click={() => {
				popup.push({
					"title": "Test Warning",
					"message": "message content to go here!!!!",
					"type": "warning"
				});
				// $modal = Modals.NewFile;
			}} class="button desktop is-medium is-clear">
			<span class="icon">
				<Icon data={faFileAlt} scale={1.6} />
			</span>
		</button>

		<button on:click={() => {
				$modal = Modals.OpenFile;
			}} class="button desktop is-medium is-clear">
			<span class="icon">
				<Icon data={faFolderOpen} scale={1.6} />
			</span>
		</button>

		<button on:click={() => {
				$modal = Modals.SaveFile;
			}} class="button desktop is-medium is-clear">
			<span class="icon">
				<Icon data={faSave} scale={1.6} />
			</span>
		</button>

		<button on:click={() => {
				$modal = Modals.CopyFile;
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
		<button class="button mobile is-medium is-clear">
			<span class="icon">
				<Icon data={faBars} scale={1.6} />
			</span>
		</button>

	</div>

</div>

<style lang="scss">
	@charset "utf-8";
	@import "src/constants.scss";

	h1 {
		font-size: 2rem;
		font-weight: 50;
		font-family: "comfortaa";
		color: whitesmoke;
	}

	.divider {
		width: 1px;
		display: flex;
		margin-left: 4px;
		margin-right: 4px;
		margin-top: 0px;
		margin-bottom: 0px;
		background-color: whitesmoke;
	}

	/* Navbar Styling */
	.nav {
		flex: 0 0 auto;
		display: flex;
		justify-content: flex-end;
		align-items: center;
		width: 100%;
		background-color: $primary;
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

	/* Button Styling */
	.button {
		margin: 4px;
	}

	.button:focus {
		outline: none;
		box-shadow: none;
	}

	.is-clear {
		color: whitesmoke;
		background-color: transparent;
		border: none;
	}

	.is-clear:hover {
		background-color: rgba(83, 83, 83, 0.5);
	}

	/* Mobile/Desktop Display Overflow */
	.mobile {
		display: none;
	}

	.desktop {
		display: block;
	}

	@media screen and (max-width: ($desktop - 1)) {
		.mobile {
			display: block !important;
		}

		.desktop {
			display: none !important;
		}
	}
</style>
