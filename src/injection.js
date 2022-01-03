import MenuItem from './MenuItem.svelte';
import DialogRenderer from './DialogRenderer.svelte';

const renderer = new DialogRenderer({
	target: document.body,
});

async function findAndRemove(node) {
	const { options } = await chrome.storage.sync.get('options');

	if (options?.blocks?.channel) {
		for (const info of options.blocks.channel) {
			const elemA = node.querySelector(`a[href="${info.url}"]`);
			if (elemA) {
				node.style.display = 'none';

				return true;
			}
		}
	}

	return false;
}

async function main() {
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

	// 기존의 노드에서 검사 후 삭제
	const existNodeList = document.body.querySelectorAll('ytd-video-renderer');
	for (const node of existNodeList) {
		findAndRemove(node);
	}

	// 옵져버 생성
	const observer = new MutationObserver((mutationsList, observer) => {
		// 검색 결과가 계속 나오면 검사 수행
		for (const mutations of mutationsList) {
			if (mutations.target instanceof HTMLElement) {
				if (mutations.target.tagName.toLowerCase() === 'ytd-video-renderer') {
					findAndRemove(mutations.target);
				}
			}
		}
	});

	// 옵져버 시작
	observer.observe(document.documentElement, { attributes: true, childList: true, subtree: true });
}

main();
