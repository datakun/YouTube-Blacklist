<script>
	import IconButton, { Icon } from '@smui/icon-button';
	import { Svg } from '@smui/common/elements';
	import { mdiClose } from '@mdi/js';
	import Snackbar, { Label, Actions } from '@smui/snackbar';
	import { t } from '../common/utils';
	import { openSnackbar, snackbarMessage } from '../contentStore';

	let snackbar = null;

	// content_scripts 에서 스낵바 요청올 때 처리
	openSnackbar.subscribe((value) => {
		if (value === true) {
			snackbar?.open();
		} else {
			snackbar?.close();
		}
	});

	function handleClose() {
		openSnackbar.set(false);
	}
</script>

<Snackbar bind:this={snackbar} on:SMUISnackbar:closed={handleClose}>
	<Label style="font-size: 16px;">{$snackbarMessage}</Label>
	<Actions>
		<IconButton title={t('remove')} on:click={handleClose}>
			<Icon component={Svg} viewBox="0 0 24 24">
				<path d={mdiClose} />
			</Icon>
		</IconButton>
	</Actions>
</Snackbar>

<style>
</style>
