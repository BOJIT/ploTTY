import { writable } from 'svelte/store';

// DEPRECATED!

/*----------------------- Modal Store with Default Values --------------------*/

const MODAL = {
	active: false,
	title: "Example Modal",
	confirm: undefined
};

const { subscribe, set, update } = writable(MODAL);

/*------------------------------- Public Functions ---------------------------*/

/**
 * @brief Show modal on screen
 */
function showModal(title: string, confirm: boolean | (() => void)) {
	update((state) => {
		state.title = title;
		state.confirm = confirm;
		state.active = true;
		return state;
	});
}

/**
 * @brief Hide modal on screen
 */
function hideModal() {
	update((state) => {
		state.active = false;
		return state;
	});
}

/**
 * @brief reset modal to default state
 */
function reset() {
	set(MODAL);
}

export default {
	showModal,
	hideModal,
	subscribe,
	reset
};
