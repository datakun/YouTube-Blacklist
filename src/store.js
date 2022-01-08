import { writable } from 'svelte/store';

let _openDialog = false;

let _dialogInfo = {
	type: '', // 'channel' or 'video'
	name: '',
	image: '',
	url: '',
};

let _openSnackbar = false;

let _snackbarMessage = '';

export const openDialog = writable(_openDialog);

export const dialogInfo = writable(_dialogInfo);

export const openSnackbar = writable(_openSnackbar);

export const snackbarMessage = writable(_snackbarMessage);
