import { writable } from 'svelte/store';

export const openDialog = writable(false);

export const dialogInfo = writable({
	type: '', // 'channel' or 'video'
	name: '',
	image: '',
	url: '',
});

export const openSnackbar = writable(false);

export const snackbarMessage = writable('');
