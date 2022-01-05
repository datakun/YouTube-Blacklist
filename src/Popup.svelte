<script>
	import Button, { Label } from '@smui/button';
	import Dialog, { Title, Content, Actions } from '@smui/dialog';
	import { openDialog, blockInfo } from './store';

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
			if (item.name === info.name) {
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

		// 스토리지에 저장
		chrome.storage.sync.set({ options });

		// 결과에서 숨기기
		const elemA = document.querySelector(`div#channel-info.ytd-video-renderer > a[href="${info.url}"]`);
		if (elemA && elemA.closest('ytd-video-renderer')) {
			elemA.closest('ytd-video-renderer').style.display = 'none';
		}

		handleClose();
	}

	function handleClickNo() {
		handleClose();
	}
</script>

<Dialog bind:open aria-labelledby="title" aria-describedby="content" on:SMUIDialog:closed={handleClose}>
	<Title style="font-size: 18px;">YouTube Blacklist</Title>
	<Content style="font-size: 14px;">
		<br />
		Block this channel?
		<br />
		<div class="channel-container">
			<img class="channel-profile-image" width="24" height="24" alt={info.name} src={info.image} />
			<span class="channel-name">{info.name}</span>
		</div>
	</Content>
	<Actions style="font-size: 14px;">
		<Button on:click={handleClickNo}>
			<Label>No</Label>
		</Button>
		<Button on:click={handleClickYes}>
			<Label>Yes</Label>
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
