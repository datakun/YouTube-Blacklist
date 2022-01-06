import { writable } from 'svelte/store';

let _openDialog = false;
let _blockInfo = {
	type: '', // 'channel' or 'video'
	name: '',
	image: '',
	url: '',
};

let _openSnackbar = false;
let _snackbarMessage = '';

export const openDialog = writable(_openDialog);

export const blockInfo = writable(_blockInfo);

export const openSnackbar = writable(_openSnackbar);

export const snackbarMessage = writable(_snackbarMessage);
