<script>
	import Button, { Label } from '@smui/button';
	import { youtubeChannelPattern, youtubeVideoPattern } from './environment';
	import { hasBlockedInfo, registerBlockInfo, t } from './utils';
	import ChromeApi from './ChromeApi';

	$: isBlocked = false;

	let rawInfo = {
		type: '',
		name: '',
		url: '',
	};

	function handleClose() {
		rawInfo = {
			type: '',
			name: '',
			url: '',
		};
		window.close();
	}

	async function handleClickYes() {
		// 차단 아이템 추가
		await registerBlockInfo(rawInfo);

		// 스낵바 열기
		if (rawInfo.type === 'channel') {
			ChromeApi.openSnackbar(t('you_have_blocked_the_channel'));
		} else {
			ChromeApi.openSnackbar(t('you_have_blocked_the_video'));
		}

		handleClose();
	}

	function handleClickNo() {
		handleClose();
	}

	chrome.tabs.query({ active: true, currentWindow: true }, async (tabs) => {
		const tab = tabs[0];
		if (tab) {
			const url = tab.url;
			// 영상 페이지인지 채널 페이지인지 확인
			if (url.match(youtubeChannelPattern)) {
				rawInfo = {
					type: 'channel',
					name: tab.title.replace(' - YouTube', ''),
					url: url,
				};

				isBlocked = await hasBlockedInfo([rawInfo]);
			} else if (url.match(youtubeVideoPattern)) {
				rawInfo = {
					type: 'video',
					name: tab.title.replace(' - YouTube', ''),
					url: url,
				};

				isBlocked = await hasBlockedInfo([rawInfo]);
			} else {
				rawInfo = {
					type: '',
					name: '',
					url: '',
				};
			}
		}
	});
</script>

<div class="dialog-box">
	<div class="dialog-title">{t('youtube_blacklist')}</div>
	<div class="dialog-content">
		{#if rawInfo.type === ''}
			<!-- 영상, 채널 정보를 찾을 수 없는 경우 -->
			<div class="channel-container">
				{t('youtube_blacklist_message')}
			</div>
		{:else if isBlocked}
			<!-- 정보를 찾을 수 있지만 차단된 경우 -->
			{#if rawInfo.type === 'channel'}
				<div class="channel-container">
					{t('already_blocked_channel')}
				</div>
			{:else if rawInfo.type === 'video'}
				<div class="channel-container">
					{t('already_blocked_video')}
				</div>
			{/if}
		{:else}
			<!-- 차단되지 않은 경우 -->
			{#if rawInfo.type === 'channel'}
				{t('block_this_channel_ask')}
			{:else}
				{t('block_this_video_ask')}
			{/if}
			<br />
			<div class="channel-container">
				<span class="channel-name">{rawInfo.name}</span>
			</div>
		{/if}
	</div>
	{#if rawInfo.type !== '' && isBlocked === false}
		<div class="action-container">
			<Button on:click={handleClickYes}>
				<Label>{t('yes')}</Label>
			</Button>
			<Button on:click={handleClickNo}>
				<Label>{t('no')}</Label>
			</Button>
		</div>
	{/if}
</div>

<style>
	.dialog-box {
		display: flex;
		flex-direction: column;
		min-width: 320px;
	}

	.dialog-title {
		padding-top: 8px;
		padding-bottom: 8px;
		padding-left: 16px;
		padding-right: 16px;
		font-size: 18px;
	}

	.dialog-content {
		padding-top: 8px;
		padding-left: 16px;
		padding-right: 16px;
		padding-bottom: 8px;
		font-size: 14px;
		word-break: keep-all;
	}

	.action-container {
		display: flex;
		flex-direction: row-reverse;
		font-size: 14px;
	}

	.channel-container {
		display: flex;
		align-items: center;
		margin-top: 8px;
	}

	.channel-name {
		margin-left: 8px;
	}
</style>
