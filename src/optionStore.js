import { writable } from 'svelte/store';

export const channelList = writable([]);

export const videoList = writable([]);

export const buttonState = writable({
	canSave: {
		channel: false,
		video: false,
	},
	canCancel: {
		channel: false,
		video: false,
	},
});

export const openImportDialog = writable(false);

export const importDialogInfo = writable({
	message: '',
	options: {
		blocks: {
			channel: [],
			video: [],
		},
	},
	newOptions: {
		blocks: {
			channel: [],
			video: [],
		},
	},
});

export const openSnackbar = writable(false);

export const snackbarMessage = writable('');
