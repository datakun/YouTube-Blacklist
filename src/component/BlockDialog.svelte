<script>
	import Button, { Label } from '@smui/button';
	import Dialog, { Title, Content, Actions } from '@smui/dialog';
	import { openDialog, dialogInfo, openSnackbar, snackbarMessage } from '../contentStore';
	import { registerBlockInfo, t } from '../common/utils';
	import { youtubeBlockPattern, youtubeMainItemTag, youtubeSearchItemTag } from '../common/environment';

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
	dialogInfo.subscribe((value) => {
		rawInfo = value;
	});

	function handleClose() {
		openDialog.set(false);
		dialogInfo.set({
			type: '',
			name: '',
			image: '',
			url: '',
		});
	}

	async function handleClickYes() {
		// 차단 아이템 추가
		await registerBlockInfo(rawInfo);

		// youtube url 에서 watch|channel|user|c 부터 주소 추출
		const href = rawInfo.url.match(youtubeBlockPattern)?.[1];
		if (href) {
			// 결과에서 숨기기
			const blockElementList = document.querySelectorAll(`a[href="/${href}"]`);
			for (const element of blockElementList) {
				let targetNode = element.closest(youtubeSearchItemTag);
				if (targetNode === null) {
					targetNode = element.closest(youtubeMainItemTag);
				}

				if (targetNode) {
					targetNode.style.display = 'none';
				}
			}
		}

		// 스낵바 열기
		if (rawInfo.type === 'channel') {
			snackbarMessage.set(t('you_have_blocked_the_channel'));
			openSnackbar.set(true);
		} else {
			snackbarMessage.set(t('you_have_blocked_the_video'));
			openSnackbar.set(true);
		}

		handleClose();
	}

	function handleClickNo() {
		handleClose();
	}

	/**
	 *
	 * @param {Event} e
	 */
	function handleClickOutside(e) {
		if (e.target instanceof HTMLElement) {
			if (e.target.id === 'datakun-ytb-dialog-block') {
				handleClose();
			}
		}
	}
</script>

<Dialog id="datakun-ytb-dialog-block" bind:open aria-labelledby="title" aria-describedby="content" on:SMUIDialog:closed={handleClose} on:click={handleClickOutside}>
	<Title style="font-size: 18px;">{t('youtube_blacklist')}</Title>
	<Content style="padding-top: 16px; font-size: 14px; word-break: keep-all;">
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
