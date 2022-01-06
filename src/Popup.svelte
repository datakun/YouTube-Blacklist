<script>
	import Button, { Label } from '@smui/button';
	import Dialog, { Title, Content, Actions } from '@smui/dialog';
	import IconButton, { Icon } from '@smui/icon-button';
	import { Svg } from '@smui/common/elements';
	import { mdiClose } from '@mdi/js';
	import Snackbar from '@smui/snackbar';
	import { openDialog, blockInfo } from './store';
	import { t } from './utils';

	let snackbar = null;
	$: snackbarType = 'channel';

	let open = false;
	openDialog.subscribe((value) => {
		open = value;
	});

	let info = {
		type: '',
		name: '',
		image: '',
		url: '',
	};
	blockInfo.subscribe((value) => {
		info = value;
	});

	function handleClose() {
		openDialog.set(false);
		blockInfo.set({
			type: '',
			name: '',
			image: '',
			url: '',
		});
	}

	async function handleClickYes() {
		// 스토리지에 저장된 값 가져오기
		const { options } = await chrome.storage.sync.get('options');

		// 중복 확인 후 추가
		let isDuplicate = false;
		for (const item of options.blocks[info.type]) {
			if (item.url === info.url) {
				isDuplicate = true;
				break;
			}
		}

		if (isDuplicate === false) {
			options.blocks[info.type].push({
				type: info.type,
				name: info.name,
				url: info.url,
			});
		}

		snackbarType = info.type;

		// 스토리지에 저장
		chrome.storage.sync.set({ options });

		// 결과에서 숨기기
		const blockElementList = document.querySelectorAll(`a[href="${info.url}"]`);
		for (const element of blockElementList) {
			if (element && element.closest('ytd-video-renderer')) {
				element.closest('ytd-video-renderer').style.display = 'none';
			}
		}

		handleClose();

		snackbar.open();
	}

	function handleClickNo() {
		handleClose();
	}
</script>

<Dialog bind:open aria-labelledby="title" aria-describedby="content" on:SMUIDialog:closed={handleClose}>
	<Title style="font-size: 18px;">{t('youtube_blacklist')}</Title>
	<Content style="font-size: 14px;">
		<br />
		{#if info.type === 'channel'}
			{t('block_this_channel_ask')}
		{:else}
			{t('block_this_video_ask')}
		{/if}
		<br />
		<div class="channel-container">
			{#if info.type === 'channel'}
				<img class="channel-profile-image" width="24" height="24" alt={info.name} src={info.image} />
			{/if}
			<span class="channel-name">{info.name}</span>
		</div>
	</Content>
	<Actions>
		<Button style="font-size: 14px;" on:click={handleClickNo}>
			<Label>{t('no')}</Label>
		</Button>
		<Button style="font-size: 14px;" on:click={handleClickYes}>
			<Label>{t('yes')}</Label>
		</Button>
	</Actions>
</Dialog>

<Snackbar bind:this={snackbar}>
	{#if snackbarType === 'channel'}
		<Label style="font-size: 16px;">{t('you_have_blocked_the_channel')}</Label>
	{:else}
		<Label style="font-size: 16px;">{t('you_have_blocked_the_video')}</Label>
	{/if}
	<Actions>
		<IconButton title={t('remove')} on:click={() => snackbar.close()}>
			<Icon component={Svg} viewBox="0 0 24 24">
				<path fill="currentColor" d={mdiClose} />
			</Icon>
		</IconButton>
	</Actions>
</Snackbar>

<style>
	.channel-container {
		display: flex;
		align-items: center;
		margin-top: 8px;
	}

	.channel-profile-image {
		border-radius: 50%;
	}

	.channel-name {
		margin-left: 8px;
	}
</style>
