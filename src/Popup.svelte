<script>
	import Button, { Label } from '@smui/button';
	import { Title, Content, Actions } from '@smui/dialog';
	import { openDialog, blockInfo } from './store';
	import { _ } from 'svelte-i18n';
	import { i18nService } from './i18n/i18nService';

	i18nService();

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
		blockInfo.set({
			type: '',
			name: '',
			image: '',
			url: '',
		});
	}

	async function handleClickYes() {
		// // 스토리지에 저장된 값 가져오기
		// const { options } = await chrome.storage.sync.get('options');

		// // 중복 확인 후 추가
		// let isDuplicate = false;
		// for (const item of options.blocks[info.type]) {
		// 	if (item.name === info.name) {
		// 		isDuplicate = true;
		// 		break;
		// 	}
		// }
		// if (isDuplicate === false) {
		// 	options.blocks[info.type].push({
		// 		type: info.type,
		// 		name: info.name,
		// 		url: info.url,
		// 	});
		// }

		// // 스토리지에 저장
		// chrome.storage.sync.set({ options });

		// // 결과에서 숨기기
		// const elemA = document.querySelector(`div#channel-info.ytd-video-renderer > a[href="${info.url}"]`);
		// if (elemA && elemA.closest('ytd-video-renderer')) {
		// 	elemA.closest('ytd-video-renderer').style.display = 'none';
		// }

		handleClose();
	}

	function handleClickNo() {
		handleClose();
	}
</script>

<Title style="font-size: 18px;">{$_('youtube-blacklist')}</Title>
<Content style="font-size: 14px;">
	<br />
	{#if info.type === 'channel'}
		{$_('block-this-channel-ask')}
	{:else}
		{$_('block-this-video-ask')}
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
		<Label>{$_('no')}</Label>
	</Button>
	<Button style="font-size: 14px;" on:click={handleClickYes}>
		<Label>{$_('yes')}</Label>
	</Button>
</Actions>

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
