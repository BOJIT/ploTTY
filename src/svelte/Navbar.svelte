<script lang="ts">
	/* Font Awesome */
	import Icon from 'svelte-awesome';
	import { faPlay, faStop, faFileAlt, faFolderOpen, faSave, faCopy, faCog, faBars } from '@fortawesome/free-solid-svg-icons';

	/* Images */
	import imgBojitLogo from '../assets/img/bojit_logo_square.png';

	/* Stores */
	// import modal from './store/modal';
	import { modal } from './store/overlays';

	import Modals from './modals';

	/* Modal confirmation handlers (temp) */
	function handleConfirm() {
		console.log("Hey there!");
	}

	function handleSettings() {
		$modal = Modals.Settings;
		// modal.showModal('Settings', {test: "hey"}, false);
	}
</script>

<div class="navbar is-primary" role="navigation" aria-label="main navigation">
	<!-- Navbar Left-Hand Side -->
	<div class="navbar-brand">
		<div class="px-1 py-1">
			<a class="navbar-item px-0 py-0" href="https://bojit.org/" target="_blank">
				<img src="{imgBojitLogo}" alt="BOJIT logo" style="max-height:3.5rem">
			</a>
		</div>

		<div class="navbar-item">
			<h1>ploTTY</h1>
		</div>
	</div>

	<!-- Navbar Right-Hand Side -->
	<div class="navbar-menu">
		<div class="navbar-end">
			<!-- Runtime Controls -->
			<button class="button is-success is-medium">
				<span class="icon">
					<Icon data={faPlay} scale={1.6} />
				</span>
			</button>
			<button class="button is-danger is-medium">
				<span class="icon">
					<Icon data={faStop} scale={1.6} />
				</span>
			</button>
			<hr class="icon-divider">
			<!-- File Controls -->
			<button class="button is-medium is-clear">
				<span class="icon">
					<Icon data={faFileAlt} scale={1.6} />
				</span>
			</button>
			<button class="button is-medium is-clear">
				<span class="icon">
					<Icon data={faFolderOpen} scale={1.6} />
				</span>
			</button>
			<button class="button is-medium is-clear">
				<span class="icon">
					<Icon data={faSave} scale={1.6} />
				</span>
			</button>
			<button on:click={() => {
					// modal.showModal('Copy File', {tech: "no"}, handleConfirm);
				}} class="button is-medium is-clear">
				<span class="icon">
					<Icon data={faCopy} scale={1.6} />
				</span>
			</button>
			<hr class="icon-divider">
			<!-- Settings -->
			<button on:click={() => {
					handleSettings();
				}} class="button is-medium is-clear">
				<span class="icon">
					<Icon data={faCog} scale={1.6} />
				</span>
			</button>
		</div>

		<!-- Burger Menu (Overflow) -->
		<button class="button is-medium is-clear navbar-burger">
			<span class="icon">
				<Icon data={faBars} scale={1.6} />
			</span>
		</button>
		<!-- TODO this does not currently work! -->
	</div>
</div>

<style>
	h1 {
		font-size: 2rem;
		font-weight: 50;
		font-family: "comfortaa";
	}

	hr.icon-divider{
		width: 1px;
		height: 60%;
		margin-left: 4px;
		margin-right: 4px;
	}

	.navbar {
		flex: 0 0 auto;
	}

	.navbar-end {
		align-items: center;
		margin-right: 4px;
	}

	.navbar-end > button {
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
</style>
