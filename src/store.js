import { writable } from 'svelte/store';

let _openDialog = false;
let _blockInfo = {
	type: '', // 'channel' or 'video'
	name: '',
	image: '',
	url: '',
};

export const openDialog = writable(_openDialog);

export const blockInfo = writable(_blockInfo);
