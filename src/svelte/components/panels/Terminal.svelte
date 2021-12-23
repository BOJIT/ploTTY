<div class="full">
	<h1>Terminal</h1>
</div>

<style lang="scss">
	@charset "utf-8";
	@use "src/styles/_constants.scss";
	@use "src/styles/theme.scss";

	.full {
		@include theme.themed() {
			background-color: theme.t(theme.$background-primary);
		}

		width: 100%;
		height: 100%;
	}

	h1 {
		@include theme.themed() {
			color: theme.t(theme.$text-secondary);
		}
	}
</style>
