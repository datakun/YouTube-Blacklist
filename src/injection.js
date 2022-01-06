import MenuItem from './MenuItem.svelte';
import Dialog from './Dialog.svelte';
import Snackbar from './Snackbar.svelte';
import { hasBlockedInfo } from './utils';

const dialog = new Dialog({
	target: document.body,
});

const snackbar = new Snackbar({
	target: document.body,
});

/**
 *
 * @param {HTMLElement} element
 */
async function findBlockItemAndHide(element) {
	// 테스트용 info list 작성
	const testInfoList = [];

	/** @type {HTMLAnchorElement} */
	const aChannelInfo = element.querySelector(`div#channel-info.ytd-video-renderer > a`);
	if (aChannelInfo) {
		testInfoList.push({
			type: 'channel',
			url: aChannelInfo.href,
		});
	}

	/** @type {HTMLAnchorElement} */
	const aVideoInfo = element.querySelector(`a#video-title`);
	if (aVideoInfo) {
		testInfoList.push({
			type: 'video',
			url: aVideoInfo.href,
		});
	}

	const isBlocked = await hasBlockedInfo(testInfoList);
	if (isBlocked) {
		element.style.display = 'none';
	}
}

function startMenuContainerObserver() {
	// 메뉴 아이템에 추가하기 위해 감시
	const popupNode = document.querySelector('ytd-popup-container');
	if (popupNode) {
		let menuItem = null;

		let isContainerFound = false;

		// 옵져버 생성
		const observer = new MutationObserver((mutationsList, observer) => {
			const menuContainer = document.querySelector('tp-yt-paper-listbox#items');

			if (isContainerFound === true) {
				// 메뉴 컨테이너를 찾으면 옵져버 중지
				observer.disconnect();

				// 메뉴 컨테이너를 찾으면 메뉴 아이템 붙이기
				menuItem = new MenuItem({
					target: menuContainer,
				});
			}

			if (menuContainer) {
				isContainerFound = true;
			}
		});

		// 옵져버 시작
		observer.observe(popupNode, { childList: true, subtree: true });
	}
}

function startSearchResultObserver() {
	// 옵져버 생성
	const observer = new MutationObserver((mutationsList, observer) => {
		// 검색 결과가 계속 나오면 검사 수행
		for (const mutations of mutationsList) {
			if (mutations.target instanceof HTMLElement) {
				if (mutations.target.tagName.toLowerCase() === 'ytd-video-renderer') {
					findBlockItemAndHide(mutations.target);
				}
			}
		}
	});

	// 옵져버 시작
	observer.observe(document.documentElement, { attributes: true, childList: true, subtree: true });
}

async function main() {
	startMenuContainerObserver();

	// 기존의 노드에서 검사 후 삭제
	const existNodeList = document.body.querySelectorAll('ytd-video-renderer');
	for (const node of existNodeList) {
		findBlockItemAndHide(node);
	}

	startSearchResultObserver();
}

main();
