function isDarkMode() {
	// 유튜브 다크 모드 확인
	return document.documentElement.getAttribute('dark') === 'true';
}

async function insertStyles(tabId) {
	const [injectResult] = await chrome.scripting.executeScript({
		target: { tabId: tabId },
		func: isDarkMode,
	});

	if (injectResult.result !== null && injectResult.result !== undefined) {
		let filename = './build/smui.css';
		if (injectResult.result === true) {
			// 유튜브가 다크 테마일 경우 파일명 변경
			filename = './build/smui-dark.css';
		}

		// 스타일 삽입
		await chrome.scripting.insertCSS({
			target: { tabId: tabId },
			files: [filename],
		});
	}
}

async function main() {
	// 저장된 옵션 값 가져오기
	let { options } = await chrome.storage.sync.get('options');
	if (!options) {
		// 저장된 값이 없으면 초기값 설정
		options = {
			blocks: {
				channel: [],
				video: [],
			},
		};

		await chrome.storage.sync.set({ options });
	}

	// 탭이 업데이트 되면 할 일 등록
	chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
		if (changeInfo.status === 'loading') {
			// 검색 결과 url 에서만 스타일 삽입
			if (tab.url) {
				if (tab.url.startsWith('https://www.youtube.com/results?search_query=')) {
					insertStyles(tabId);
				}
			}
		}
	});
}

main();
