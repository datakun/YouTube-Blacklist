<script>
	import { blockInfo, openDialog } from './store';

	function handleClickBlockChannel(e) {
		e.preventDefault();
		e.stopPropagation();

		// 드랍다운 메뉴 숨기기
		const dropdown = document.querySelector('tp-yt-iron-dropdown');
		if (dropdown) {
			dropdown.style.display = 'none';
		}

		// 다이얼로그에 띄울 내용 준비
		const channelInfoList = document.querySelectorAll('div#channel-info');
		const menuList = document.querySelectorAll('div#menu.ytd-video-renderer');

		for (let i = 0; i < menuList.length; i++) {
			const menuDiv = menuList[i];
			const menuRenderer = menuDiv.querySelector('ytd-menu-renderer');
			// 활성화 된 메뉴 인덱스 찾기
			if (menuRenderer.getAttribute('menu-active') !== null) {
				// 인덱스로 채널 정보 조회
				const currentChannelInfo = channelInfoList[i];
				if (currentChannelInfo) {
					const elemA = currentChannelInfo.querySelector('a');
					const elemImg = currentChannelInfo.querySelector('img');
					const elemName = currentChannelInfo.querySelector('ytd-channel-name');
					if (elemA?.href && elemImg?.src && elemName?.innerText) {
						// 스토어에 변경
						blockInfo.set({
							type: 'channel',
							name: elemName.innerText,
							image: elemImg.src,
							url: elemA.getAttribute('href'),
						});

						// 다이얼로그 띄우기
						openDialog.set(true);
					}
				}

				break;
			}
		}
	}
</script>

<div class="datakun-ytb-button-container" role="menuitem" aria-selected="false" tabindex="-1" on:click={handleClickBlockChannel}>Block this channel</div>

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
