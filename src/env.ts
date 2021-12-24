/* Definitions for Webpack-passed Environment Variables */
declare const __COMMIT_HASH__: String;
declare const __GIT_TAG__: String;

export default {
	__COMMIT_HASH__: __COMMIT_HASH__,
	__GIT_TAG__: __GIT_TAG__
};