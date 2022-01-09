import Options from './component/Options.svelte';
import ImportDialog from './component/ImportDialog.svelte';
import Snackbar from './component/Snackbar.svelte';

/** @type {SvelteComponentDev} */
const options = new Options({
	target: document.body,
});

/** @type {SvelteComponentDev} */
const dialog = new ImportDialog({
	target: document.body,
});

/** @type {SvelteComponentDev} */
const snackbar = new Snackbar({
	target: document.body,
});

export default options;
