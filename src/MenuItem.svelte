<script>
	import { blockInfo, openDialog } from './store';
	import { _ } from 'svelte-i18n';
	import { i18nService } from './i18n/i18nService';

	i18nService();

	function hideDropdownMenu() {
		const dropdown = document.querySelector('tp-yt-iron-dropdown');
		if (dropdown) {
			dropdown.style.display = 'none';
		}
	}

	function openBlockDialog(_blockInfo) {
		// 스토어에 변경
		blockInfo.set(_blockInfo);

		// 다이얼로그 띄우기
		openDialog.set(true);
	}

	function getActivatedMenuIndex() {
		const menuList = document.querySelectorAll('div#menu.ytd-video-renderer');

		let isFound = false;
		let index = 0;
		for (; index < menuList.length; index++) {
			const menuDiv = menuList[index];
			const menuRenderer = menuDiv.querySelector('ytd-menu-renderer');
			// 활성화 된 메뉴 인덱스 찾기
			if (menuRenderer.getAttribute('menu-active') !== null) {
				isFound = true;

				break;
			}
		}

		if (isFound === false) {
			// 메뉴를 다 탐색할 동안 찾지 못함
			return -1;
		}

		return index;
	}

	function handleClickBlockChannel(e) {
		e.preventDefault();
		e.stopPropagation();

		// 드랍다운 메뉴 숨기기
		hideDropdownMenu();

		// 다이얼로그에 띄울 내용 준비
		// NOTE: 채널 이름, 썸네일, 채널 주소
		const menuIndex = getActivatedMenuIndex();
		if (menuIndex === -1) {
			// 클릭한 메뉴를 찾지 못함
			console.log('YouTube Blacklist: Not found activated menu.');

			return;
		}

		// 인덱스로 채널 정보 조회
		const channelInfoList = document.querySelectorAll('div#channel-info.ytd-video-renderer');
		const currentChannelInfo = channelInfoList[menuIndex];
		if (currentChannelInfo) {
			// 채널 이름, 썸네일, 채널 주소
			const elemA = currentChannelInfo.querySelector('a');
			const elemImg = currentChannelInfo.querySelector('img');
			const elemName = currentChannelInfo.querySelector('ytd-channel-name');
			if (elemA?.href && elemImg?.src && elemName?.innerText) {
				const blockInfo = {
					type: 'channel',
					name: elemName.innerText,
					image: elemImg.src,
					url: elemA.getAttribute('href'),
				};

				openBlockDialog(blockInfo);
			}
		}
	}

	function handleClickBlockVideo(e) {
		e.preventDefault();
		e.stopPropagation();

		// 드랍다운 메뉴 숨기기
		hideDropdownMenu();

		// 다이얼로그에 띄울 내용 준비
		// NOTE: 비디오 이름, 비디오 주소
		const menuIndex = getActivatedMenuIndex();
		if (menuIndex === -1) {
			// 클릭한 메뉴를 찾지 못함
			console.log('YouTube Blacklist: Not found activated menu.');

			return;
		}

		// 인덱스로 비디오 정보 조회
		const thumbnailList = document.querySelectorAll('ytd-thumbnail.ytd-video-renderer');
		const currentThumbnail = thumbnailList[menuIndex];
		if (currentThumbnail) {
			// 채널 이름, 썸네일, 채널 주소
			const elemA = currentThumbnail.querySelector('a#thumbnail');
			const elemName = currentThumbnail.parentElement.querySelector('a#video-title');
			if (elemA?.href && elemName?.innerText) {
				const blockInfo = {
					type: 'video',
					name: elemName.innerText,
					image: '',
					url: elemA.getAttribute('href'),
				};

				openBlockDialog(blockInfo);
			}
		}
	}
</script>

<div class="datakun-ytb-button-container" role="menuitem" aria-selected="false" tabindex="-1" on:click={handleClickBlockChannel}>{$_('block-this-channel')}</div>
<div class="datakun-ytb-button-container" role="menuitem" aria-selected="false" tabindex="-1" on:click={handleClickBlockVideo}>{$_('block-this-video')}</div>

<style>
	div.datakun-ytb-button-container {
		display: flex;
		align-items: center;
		height: 36px;
		padding-left: 16px;
		font-size: 14px;
		cursor: pointer;
	}
</style>
