<script lang="ts">
	import Prism from 'prismjs';
	import 'prismjs/components/prism-json.min.js';
	import 'prismjs/themes/prism-tomorrow.min.css';
	import 'prismjs/plugins/line-numbers/prism-line-numbers.min.js';
	import 'prismjs/plugins/line-numbers/prism-line-numbers.min.css';

	import { onMount, afterUpdate } from 'svelte';
	import { createEventDispatcher } from 'svelte';
	const dispatch = createEventDispatcher();

	export let code = JSON.stringify({
		test: "test",
		key: true
	}, null, 2);

	let editor: HTMLElement;

	/*------------------------ Editor Caret Restorer -------------------------*/

	function getNodeIndex(n){var i=0;while(n=n.previousSibling)i++;return i}

	let rp: any = {};
	function saveRangePosition()
	{
		let range = window.getSelection().getRangeAt(0);
		let sC = range.startContainer, eC = range.endContainer;

		let A = [];
		while(sC!==editor) {
			A.push(getNodeIndex(sC));
			sC = sC.parentNode;
		}
		let B = [];
		while(eC!==editor) {
			B.push(getNodeIndex(eC));
			eC = eC.parentNode;
		}

		rp = {"sC":A,"sO":range.startOffset,"eC":B,"eO":range.endOffset};
	}

	function restoreRangePosition()
	{
		editor.focus();
		let sel = window.getSelection(), range = sel.getRangeAt(0);
		let x , C, sC: any = editor, eC: any = editor;

		C=rp.sC;x=C.length;while(x--)sC=sC.childNodes[C[x]];
		C=rp.eC;x=C.length;while(x--)eC=eC.childNodes[C[x]];

		try {
			range.setStart(sC,rp.sO);
			range.setEnd(eC,rp.eO);
			sel.removeAllRanges();
			sel.addRange(range)
		} catch (error) {
			console.warn("Odd text relocation bug: fix later");
		}
	}

	/*----------------------- Keep Syntax Up-To-Date -------------------------*/

	onMount(() => {
		Prism.highlightAll();

		editor.addEventListener("input", function() {
			saveRangePosition();
			Prism.highlightAll();

			code = editor.innerText;
			dispatch('codeChange');

			restoreRangePosition();
		}, false);
	});

	afterUpdate(() => {
		Prism.highlightAll();
	});
</script>

<pre class="line-numbers">
	<code bind:this={editor} class="language-json" contenteditable="true">
		{code}
	</code>
</pre>

<style lang="scss">
	@charset "utf-8";
	@use "src/styles/_constants.scss";
	@use "src/styles/theme.scss";

	[contenteditable] {
		outline: 0px solid transparent;
	}
</style>
