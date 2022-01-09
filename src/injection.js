import BlockMenu from './BlockMenu.svelte';
import BlockDialog from './BlockDialog.svelte';
import BlockSnackbar from './BlockSnackbar.svelte';
import { getCurrentPageType, hasBlockedInfo, t } from './utils';
import { SvelteComponentDev } from 'svelte/internal';
import { openSnackbar, snackbarMessage } from './store';
import { youtubeMainItemTag, youtubeSearchItemTag } from './environment';

/** @type {SvelteComponentDev} */
const dialog = new BlockDialog({
	target: document.body,
});

/** @type {SvelteComponentDev} */
const snackbar = new BlockSnackbar({
	target: document.body,
});

/** @type {SvelteComponentDev} */
let menuBlockChannel = null;
/** @type {SvelteComponentDev} */
let menuBlockVideo = null;

let currentPageType = '';

/**
 *
 * @param {HTMLElement} parentNode
 */
function findBlockItemAndHide(parentNode) {
	// 테스트용 info list 작성
	const testInfoList = [];

	const tagName = parentNode.tagName.toLowerCase();
	if (tagName === youtubeSearchItemTag) {
		/** @type {HTMLAnchorElement} */
		const aChannelInfo = parentNode.querySelector(`div#channel-info.ytd-video-renderer > a`);
		if (aChannelInfo) {
			testInfoList.push({
				type: 'channel',
				url: aChannelInfo.href,
			});
		}

		/** @type {HTMLAnchorElement} */
		const aVideoInfo = parentNode.querySelector(`a#video-title`);
		if (aVideoInfo) {
			testInfoList.push({
				type: 'video',
				url: aVideoInfo.href,
			});
		}
	} else if (tagName === youtubeMainItemTag) {
		/** @type {HTMLAnchorElement} */
		const aChannelInfo = parentNode.querySelector(`div#details.ytd-rich-grid-media > a#avatar-link`);
		if (aChannelInfo) {
			testInfoList.push({
				type: 'channel',
				url: aChannelInfo.href,
			});
		}

		/** @type {HTMLAnchorElement} */
		const aVideoInfo = parentNode.querySelector(`div#details.ytd-rich-grid-media a#video-title-link`);
		if (aVideoInfo) {
			testInfoList.push({
				type: 'video',
				url: aVideoInfo.href,
			});
		}
	}

	hasBlockedInfo(testInfoList).then((isBlocked) => {
		if (isBlocked) {
			parentNode.style.display = 'none';
		}
	});
}

/**
 *
 * @param {HTMLElement} clickedMenuDiv
 * @param {HTMLElement} menuContainer
 */
function injectMenus(clickedMenuDiv, menuContainer) {
	/** @type {HTMLElement} */
	let elementContainer = null;
	/** @type {HTMLAnchorElement} */
	let aChannel = null;
	/** @type {HTMLAnchorElement} */
	let aVideo = null;
	let channelName = '';
	let channelImg = '';
	let videoName = '';

	if (currentPageType === 'main') {
		// 메인 페이지에서 메뉴를 주입하려는 경우
		// elementContainer = clickedMenuDiv.closest(youtubeMainItemTag);
		// aChannel = elementContainer.querySelector('a#avatar-link');
		// aVideo = elementContainer.querySelector('a#video-title-link');
		// channelName = aChannel.title;
		// channelImg = aChannel.querySelector('img').src;
		// videoName = aVideo.title;
		return;
	} else if (currentPageType === 'search') {
		// 검색 결과 페이지에서 메뉴를 주입하려는 경우
		elementContainer = clickedMenuDiv.closest(youtubeSearchItemTag);
		aChannel = elementContainer.querySelector('div#channel-info.ytd-video-renderer > a');
		aVideo = elementContainer.querySelector('a#video-title');
		channelName = elementContainer.querySelector('ytd-channel-name a').innerText;
		channelImg = aChannel.querySelector('img').src;
		videoName = elementContainer.querySelector('a#video-title').innerText;
	} else if (currentPageType === 'channel') {
		// 채널 페이지에서 메뉴를 주입하려는 경우
		return;
	}

	// console.log(aChannel);
	// console.log(aVideo);

	// 채널 정보를 찾으면 채널 숨기기 메뉴 확인 후 메뉴 생성 혹은 값 수정
	if (aChannel) {
		// 메뉴 버튼을 누를때마다 메뉴 컨테이너에 메뉴 아이템이 생성됐는지 확인하고
		if (menuBlockChannel) {
			// 생성 되어있다면 실제로 존재하는지 확인
			if (menuContainer.querySelector('div.datakun-ytb-block-channel') === null) {
				// 실제로 존재하지 않는다면 (어떤 이유에서 삭제가 됐다면) 변수 초기화
				menuBlockChannel = null;
			} else {
				// 존재한다면 상황에 따라 속성 설정
				menuBlockChannel.$set({
					blockName: channelName,
					blockUrl: aChannel.href,
					imageSrc: channelImg,
				});
			}
		}

		// 채널 아이콘의 hidden 속성이 존재하지 않을때만(아이콘이 있을 때만) 차단 메뉴 생성
		if (aChannel.getAttribute('hidden') === null) {
			// 메뉴 확인 과정 거친 후 메뉴 변수가 null 이라면 메뉴 생성
			if (menuBlockChannel === null) {
				// 메뉴 생성
				menuBlockChannel = new BlockMenu({
					target: menuContainer,
					props: {
						type: 'channel',
						label: t('block_this_channel'),
						blockName: channelName,
						blockUrl: aChannel.href,
						imageSrc: channelImg,
					},
				});
			}
		}
	}

	// 영상 정보를 찾으면 채널 숨기기 메뉴 확인 후 메뉴 생성 혹은 값 수정
	if (aVideo) {
		// 메뉴 버튼을 누를때마다 메뉴 컨테이너에 메뉴 아이템이 생성됐는지 확인하고
		if (menuBlockVideo) {
			// 생성 되어있다면 실제로 존재하는지 확인
			if (menuContainer.querySelector('div.datakun-ytb-block-video') === null) {
				// 실제로 존재하지 않는다면 (어떤 이유에서 삭제가 됐다면) 변수 초기화
				menuBlockVideo = null;
			} else {
				// 존재한다면 상황에 따라 속성 설정
				menuBlockVideo.$set({
					blockName: videoName,
					blockUrl: aVideo.href,
				});
			}
		}

		// 재생 목록 아이템의 메뉴 버튼을 누르지 않았을 때만 차단 메뉴 생성
		const playlistPattern = /^https?:\/\/(?:www\.)?youtube\.com\/watch\?v=([a-zA-Z0-9_-]+)&list=([a-zA-Z0-9_-]+)/;
		if (aVideo.href.match(playlistPattern) === null) {
			// 메뉴 확인 과정 거친 후 메뉴 변수가 null 이라면 메뉴 생성
			if (menuBlockVideo === null) {
				// 메뉴 생성
				menuBlockVideo = new BlockMenu({
					target: menuContainer,
					props: {
						type: 'video',
						label: t('block_this_video'),
						blockName: videoName,
						blockUrl: aVideo.href,
					},
				});
			}
		}
	}

	menuContainer.closest('ytd-menu-popup-renderer').style.maxHeight = '100%';
}

let observer = null;
let clickedMenuDiv = null;
let menuContainer = null;

/**
 * NOTE: document.body 를 클릭할때마다 메뉴 버튼을 클릭했는지 확인.
 * 메뉴 버튼을 클릭했다면 현재 상황에 맞게 메뉴를 생성
 * 1. 검색 결과 페이지에서 메뉴 버튼을 클릭했다면 채널, 영상 숨기기 메뉴 띄움
 * 2. 채널 페이지에서 메뉴 버튼을 클릭했다면 채널, 영상 숨기기 메뉴 띄움
 * 3. 영상 페이지에서는 메뉴 버튼을 클릭하는 일이 없는듯?
 * 4. 유튜브 메인 페이지에서 메뉴 버튼을 클릭햇다면 채널, 영상 숨기기 메뉴 띄움
 * @param {Event} e
 */
function handleMenuClick(e) {
	if (e.target instanceof HTMLElement) {
		clickedMenuDiv = e.target.closest('div#menu');
		if (!clickedMenuDiv) {
			return;
		}

		menuContainer = document.querySelector('tp-yt-paper-listbox#items');
		if (!menuContainer) {
			return;
		}

		if (observer === null) {
			observer = new MutationObserver(handleMenuRemoved);

			// 옵져버 시작
			observer.observe(menuContainer, { childList: true, subtree: true });
		}

		injectMenus(clickedMenuDiv, menuContainer);
	}
}

function handleMenuRemoved(mutationsList, observer) {
	for (const mutations of mutationsList) {
		// 삭제된 메뉴가 있을 때 메뉴 생성 시도
		for (const node of mutations.removedNodes) {
			if (node instanceof HTMLElement && node.classList.contains('datakun-ytb-menu')) {
				if (clickedMenuDiv && menuContainer) {
					injectMenus(clickedMenuDiv, menuContainer);
				}

				return;
			}
		}
	}
}

function startSearchResultObserver() {
	// 옵져버 생성
	const observer = new MutationObserver((mutationsList, observer) => {
		// 검색 결과가 계속 나오면 검사 수행
		for (const mutations of mutationsList) {
			if (mutations.target instanceof HTMLElement) {
				const tagName = mutations.target.tagName.toLowerCase();
				if (tagName === youtubeSearchItemTag || tagName === youtubeMainItemTag) {
					findBlockItemAndHide(mutations.target);
				}
			}
		}
	});

	// 옵져버 시작
	observer.observe(document.documentElement, { attributes: true, childList: true, subtree: true });

	return observer;
}

function main() {
	document.body.addEventListener('click', handleMenuClick, false);

	chrome.runtime.onMessage.addListener((request) => {
		// console.log('injection', request);
		if (request.action === 'tabsUpdate') {
			// 탭이 변경되면 url을 검사해서 존재하는 아이템 목록 중에 숨길 아이템 찾기.
			let existNodeList = [];

			currentPageType = getCurrentPageType(request.tab);
			if (currentPageType === 'main') {
				existNodeList = document.body.querySelectorAll(youtubeMainItemTag);
			} else if (currentPageType === 'search') {
				existNodeList = document.body.querySelectorAll(youtubeSearchItemTag);
			}

			// 기존의 노드에서 검사 후 삭제
			for (const node of existNodeList) {
				findBlockItemAndHide(node);
			}
		} else if (request.action === 'openSnackbar') {
			// 스낵바 열기
			snackbarMessage.set(request.message);
			openSnackbar.set(true);
		}
	});

	startSearchResultObserver();
}

main();
