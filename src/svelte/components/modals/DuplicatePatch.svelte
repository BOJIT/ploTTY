<script lang="ts">
	import Modal from "./Modal.svelte";
	import Icon from 'svelte-awesome';
	import { faCheck, faFile } from '@fortawesome/free-solid-svg-icons';
</script>

<Modal title="Duplicate Patch">
	<div class="field">
		<p class="control has-icons-left has-icons-right">
			<input class="input" placeholder="file name">
			<span class="icon is-small is-left">
				<Icon data={faFile} />
			</span>
			<span class="icon is-small is-right">
				<Icon data={faCheck} />
			</span>
		</p>
	</div>
</Modal>
