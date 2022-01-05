<script>
	import Button, { Label } from '@smui/button';
	import List, { Item, Separator, Text, Meta } from '@smui/list';
	import Paper from '@smui/paper';
	import { _ } from 'svelte-i18n';
	import { i18nService } from './i18n/i18nService';

	i18nService();

	$: channelList = [];
	$: videoList = [];

	async function getBlocklist(type) {
		// 스토리지에 저장된 값 가져오기
		const { options } = await chrome.storage.sync.get('options');
		if (type === 'channel') {
			channelList = options?.blocks?.channel || [];
		} else if (type === 'video') {
			videoList = options?.blocks?.video || [];
		} else {
			channelList = options?.blocks?.channel || [];
			videoList = options?.blocks?.video || [];
		}
	}

	getBlocklist();

	async function handleSaveChannelList() {
		// 스토리지 데이터 가져오기
		const { options } = await chrome.storage.sync.get('options');
		options.blocks = {
			...options.blocks,
			channel: channelList,
		};

		// 스토리지에 저장
		await chrome.storage.sync.set({ options });

		alert('Options saved.');
	}

	function handleCancelChannelList() {
		getBlocklist('channel');
	}

	async function handleSaveVideoList() {
		// 스토리지 데이터 가져오기
		const { options } = await chrome.storage.sync.get('options');
		options.blocks = {
			...options.blocks,
			video: videoList,
		};

		// 스토리지에 저장
		await chrome.storage.sync.set({ options });

		alert('Options saved.');
	}

	function handleCancelVideoList() {
		getBlocklist('video');
	}
</script>

<div class="box">
	<div class="main-container">
		<p id="title">{$_('YouTube Blacklist Options')}</p>
		<Paper>
			<div class="title-container">{$_('Channel List to Block')}</div>
			<Separator />
			<div class="block-container">
				<List class="list">
					{#each channelList as item, i}
						<Item class="item" title={item.name}>
							<Text>{item.name}</Text>
							<Meta
								class="material-icons"
								title={$_('Remove')}
								on:click={() => {
									const newList = channelList;
									newList.splice(i, 1);
									channelList = newList;
								}}
							>
								clear
							</Meta>
						</Item>
					{/each}
				</List>
			</div>
			<div class="action-container">
				<Button variant="raised" style="margin-left: 8px;" on:click={handleSaveChannelList}>
					<Label>{$_('Save')}</Label>
				</Button>
				<Button variant="outlined" on:click={handleCancelChannelList}>
					<Label>{$_('Cancel')}</Label>
				</Button>
			</div>
		</Paper>
		<Paper style="margin-top: 16px;">
			<div class="title-container">{$_('Video List to Block')}</div>
			<Separator />
			<div class="block-container">
				<List class="list">
					{#each videoList as item, i}
						<Item class="item" title={item.name}>
							<Text>{item.name}</Text>
							<Meta
								class="material-icons"
								title={$_('Remove')}
								on:click={() => {
									// 배열에서 삭제
									const newList = videoList;
									newList.splice(i, 1);
									videoList = newList;
								}}
							>
								clear
							</Meta>
						</Item>
					{/each}
				</List>
			</div>
			<div class="action-container">
				<Button variant="raised" style="margin-left: 8px;" on:click={handleSaveVideoList}>
					<Label>{$_('Cancel')}</Label>
				</Button>
				<Button variant="outlined" on:click={handleCancelVideoList}>
					<Label>{$_('Cancel')}</Label>
				</Button>
			</div>
		</Paper>
	</div>
</div>

<style>
	.box {
		width: 680px;
		min-width: 680px;
		max-width: 680px;
		margin-left: auto;
		margin-right: auto;
	}
	#title {
		font-size: 20px;
	}
	.main-container {
		padding: 8px;
		width: 100%;
	}
	.title-container {
		display: flex;
		margin: 8px;
		font-size: 16px;
	}
	.block-container {
		display: flex;
		margin: 8px;
		font-size: 14px;
	}
	.action-container {
		display: flex;
		flex-direction: row-reverse;
		margin: 8px;
		font-size: 14px;
	}
	* :global(.list) {
		width: 100%;
		display: flex;
		flex-direction: column;
	}
</style>
