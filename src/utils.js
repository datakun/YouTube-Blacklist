import { youtubeChannelPattern, youtubeMainPattern, youtubeResultPattern, youtubeVideoPattern } from './environment';

/**
 *
 * @param {string} message
 * @returns
 */
export function t(message) {
	return chrome.i18n.getMessage(message);
}

/**
 *
 * @param {chrome.tabs.Tab} tab
 * @returns
 */
export function getCurrentPageType(tab) {
	if (tab?.url) {
		const url = tab?.url;
		if (url.match(youtubeResultPattern)) {
			// 검색 결과 페이지
			return 'search';
		} else if (url.match(youtubeChannelPattern)) {
			// 채널 페이지
			return 'channel';
		} else if (url.match(youtubeVideoPattern)) {
			// 영상 페이지
			return 'video';
		} else if (url.match(youtubeMainPattern)) {
			// 시작 페이지
			return 'main';
		}
	}

	return 'unknown';
}

/**
 *
 * @param {{type: string, name: string, url: string}} blockInfo
 */
export function registerBlockInfo(blockInfo) {
	chrome.storage.sync.get('options').then(({ options }) => {
		if (blockInfo.type === 'channel') {
			if (!options.blocks.channel) {
				// 차단 아이템이 없으면 초기화
				options.blocks.channel = [];
			}

			// blockInfo.url 에서 user|channel|c 부터 추출
			// 주소에서 youtube 제거
			const channelUrl = blockInfo.url.match(youtubeChannelPattern)?.[1];
			if (channelUrl) {
				// console.log('blocked channel added.', channelUrl);

				// 차단 아이템 추가
				options.blocks.channel.push({
					type: blockInfo.type,
					name: blockInfo.name,
					url: channelUrl,
				});

				chrome.storage.sync.set({ options });
			}
		} else if (blockInfo.type === 'video') {
			if (!options.blocks.video) {
				// 차단 아이템이 없으면 초기화
				options.blocks.video = [];
			}

			// blockInfo.url watch 부터 추출
			const videoUrl = blockInfo.url.match(youtubeVideoPattern)?.[1];
			if (videoUrl) {
				// console.log('blocked video added.', videoUrl);

				// 차단 아이템 추가
				options.blocks.video.push({
					type: blockInfo.type,
					name: blockInfo.name,
					url: videoUrl,
				});

				chrome.storage.sync.set({ options });
			}
		}
	});
}

/**
 *
 * @param {{type: string, url: string}[]} infoList
 * @returns {Promise<boolean>}
 */
export function hasBlockedInfo(infoList) {
	return new Promise((resolve) => {
		chrome.storage.sync.get('options').then(({ options }) => {
			for (const info of infoList) {
				if (info.type === 'channel') {
					// 채널 url 를 가져와서 그 중 하나라도 일치하는지 확인
					const channelUrl = info.url.match(youtubeChannelPattern)?.[1];
					if (channelUrl) {
						if (options.blocks.channel.some((data) => data.url === channelUrl)) {
							// console.log('channel blocked.', info.url);
							resolve(true);

							return;
						}
					}
				} else if (info.type === 'video') {
					// 영상 url 를 가져와서 그 중 하나라도 일치하는지 확인
					const videoUrl = info.url.match(youtubeVideoPattern)?.[1];
					if (videoUrl) {
						if (options.blocks.video.some((data) => data.url === videoUrl)) {
							// console.log('video blocked.', info.url);
							resolve(true);

							return;
						}
					}
				}
			}

			resolve(false);
		});
	});
}
