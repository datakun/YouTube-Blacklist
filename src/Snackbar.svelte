<script>
	import IconButton, { Icon } from '@smui/icon-button';
	import { Svg } from '@smui/common/elements';
	import { mdiClose } from '@mdi/js';
	import Snackbar, { Label, Actions } from '@smui/snackbar';
	import { t } from './utils';

	let snackbar = null;
	$: message = '';

	function handleClose() {
		snackbar?.close();
		message = '';
	}

	chrome.runtime.onMessage.addListener(function (request) {
		if (request.action === 'open_snackbar') {
			// 스낵바 열기
			message = request.message;
			snackbar?.open();
		}
	});
</script>

<Snackbar bind:this={snackbar} on:SMUISnackbar:closed={handleClose}>
	<Label style="font-size: 16px;">{message}</Label>
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
