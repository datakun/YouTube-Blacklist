<script>
	import Button, { Label } from '@smui/button';
	import Dialog, { Title, Content, Actions } from '@smui/dialog';
	import { openDialog, blockInfo, openSnackbar, snackbarMessage } from './store';
	import { registerBlockInfo, t } from './utils';
	import { youtubeBlockPattern } from './environment';

	let open = false;
	openDialog.subscribe((value) => {
		open = value;
	});

	let rawInfo = {
		type: '',
		name: '',
		image: '',
		url: '',
	};
	blockInfo.subscribe((value) => {
		rawInfo = value;
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
		// 차단 아이템 추가
		await registerBlockInfo(rawInfo);

		// 스낵바 열기
		if (rawInfo.type === 'channel') {
			snackbarMessage.set(t('you_have_blocked_the_channel'));
		} else {
			snackbarMessage.set(t('you_have_blocked_the_video'));
		}
		openSnackbar.set(true);

		// youtube url 에서 watch|channel|user|c 부터 주소 추출
		const href = rawInfo.url.match(youtubeBlockPattern)?.[1];
		if (href) {
			// 결과에서 숨기기
			const blockElementList = document.querySelectorAll(`a[href="/${href}"]`);
			for (const element of blockElementList) {
				if (element && element.closest('ytd-video-renderer')) {
					element.closest('ytd-video-renderer').style.display = 'none';
				}
			}
		}

		handleClose();
	}

	function handleClickNo() {
		handleClose();
	}
</script>

<Dialog bind:open aria-labelledby="title" aria-describedby="content" on:SMUIDialog:closed={handleClose}>
	<Title style="font-size: 18px;">{t('youtube_blacklist')}</Title>
	<Content style="font-size: 14px;">
		<br />
		{#if rawInfo.type === 'channel'}
			{t('block_this_channel_ask')}
		{:else}
			{t('block_this_video_ask')}
		{/if}
		<br />
		<div class="channel-container">
			{#if rawInfo.type === 'channel'}
				<img class="channel-profile-image" width="24" height="24" alt={rawInfo.name} src={rawInfo.image} />
			{/if}
			<span class="channel-name">{rawInfo.name}</span>
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
