<script>
	import Button, { Label } from '@smui/button';
	import Dialog, { Title, Content, Actions } from '@smui/dialog';
	import Card from '@smui/card';
	import { openImportDialog, importDialogInfo, openSnackbar, snackbarMessage, channelList, buttonState, videoList } from '../optionStore';
	import { t } from '../common/utils';

	async function refreshOptionsPageData() {
		// 스토리지에 저장된 값 가져오기
		const { options } = await chrome.storage.sync.get('options');

		channelList.set(options?.blocks?.channel || []);
		videoList.set(options?.blocks?.video || []);

		buttonState.set({
			canSave: {
				channel: false,
				video: false,
			},
			canCancel: {
				channel: false,
				video: false,
			},
		});
	}

	function handleClose() {
		openImportDialog.set(false);
		importDialogInfo.set({
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
	}

	async function importOptions(keepOld = true) {
		const options = $importDialogInfo.options;
		const newOptions = $importDialogInfo.newOptions;

		let newChannels = [];
		let newVideos = [];
		if (keepOld === true) {
			// 기존 항목 유지하고 새로운 항목 추가
			// 중복 제거 (단순 버전)
			let tempSet = new Set([...options.blocks.channel.map((data) => JSON.stringify(data)), ...newOptions.blocks.channel.map((data) => JSON.stringify(data))]);
			for (const item of tempSet) {
				newChannels.push(JSON.parse(item));
			}
			tempSet = new Set([...options.blocks.video.map((data) => JSON.stringify(data)), ...newOptions.blocks.video.map((data) => JSON.stringify(data))]);
			for (const item of tempSet) {
				newVideos.push(JSON.parse(item));
			}
		} else {
			// 기존 항목에 새로운 항목 덮어쓰기
			newChannels = newOptions.blocks.channel;
			newVideos = newOptions.blocks.video;
		}

		options.blocks = {
			channel: newChannels,
			video: newVideos,
		};

		// 스토리지에 저장
		await chrome.storage.sync.set({ options });

		// 스낵바 열기
		snackbarMessage.set(t('options_imported'));
		openSnackbar.set(true);

		refreshOptionsPageData();
	}

	async function handleClickKeep() {
		await importOptions(true);

		handleClose();
	}

	async function handleClickOverwrite() {
		await importOptions(false);

		handleClose();
	}

	function handleClickCancel() {
		handleClose();
	}

	/**
	 *
	 * @param {Event} e
	 */
	function handleClickOutside(e) {
		if (e.target instanceof HTMLElement) {
			if (e.target.id === 'datakun-ytb-dialog-import') {
				handleClose();
			}
		}
	}
</script>

<Dialog
	id="datakun-ytb-dialog-import"
	bind:open={$openImportDialog}
	aria-labelledby="title"
	aria-describedby="content"
	on:SMUIDialog:closed={handleClose}
	on:click={handleClickOutside}
>
	<Title style="font-size: 18px;">{t('import')}</Title>
	<Content style="max-height: 40vh; padding-top: 16px; font-size: 14px; word-break: keep-all; white-space: pre-line;">
		{t('keep_old_blacklist')}
		<br />
		<Card padded>{$importDialogInfo.message}</Card>
	</Content>
	<Actions style="justify-content: space-between;">
		<Button variant="outlined" style="font-size: 14px;" on:click={handleClickCancel}>
			<Label>{t('cancel_import')}</Label>
		</Button>
		<div>
			<Button variant="outlined" style="font-size: 14px;" on:click={handleClickOverwrite}>
				<Label>{t('overwrite')}</Label>
			</Button>
			<Button variant="outlined" style="font-size: 14px;" on:click={handleClickKeep}>
				<Label>{t('keep')}</Label>
			</Button>
		</div>
	</Actions>
</Dialog>

<style>
	:global(.mdc-dialog.mdc-dialog--open) {
		display: flex;
		justify-content: center;
		align-items: center;
		position: fixed;
		left: 0;
		top: 0;
		width: 100%;
		height: 100%;
		z-index: 10000;
		background: rgba(0, 0, 0, 0.5);
	}

	:global(.mdc-dialog__scrim) {
		display: none;
	}
</style>
