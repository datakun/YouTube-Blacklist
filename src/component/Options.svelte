<script>
	import Button, { Label } from '@smui/button';
	import List, { Item, Separator, Text, Meta } from '@smui/list';
	import Paper from '@smui/paper';
	import { t } from '../common/utils';
	import { openImportDialog, importDialogInfo, channelList, buttonState, videoList } from '../optionStore';

	let inputFileOptions = null;

	async function updateOptionsPageData(type) {
		// 스토리지에 저장된 값 가져오기
		const { options } = await chrome.storage.sync.get('options');

		if (type === 'channel') {
			channelList.set(options?.blocks?.channel || []);
		} else if (type === 'video') {
			videoList.set(options?.blocks?.video || []);
		} else {
			channelList.set(options?.blocks?.channel || []);
			videoList.set(options?.blocks?.video || []);
		}

		if (type === undefined) {
			buttonState.set({
				canSave: {
					channel: false,
					video: false,
				},
				canCancel: {
					channel: false,
					video: false,
				},
			});
		} else {
			buttonState.set({
				canSave: {
					...$buttonState.canSave,
					[type]: false,
				},
				canCancel: {
					...$buttonState.canCancel,
					[type]: false,
				},
			});
		}

		return options;
	}

	updateOptionsPageData();

	async function handleSaveBlacklist(type) {
		// 스토리지 데이터 가져오기
		const { options } = await chrome.storage.sync.get('options');

		if (type === 'channel') {
			options.blocks = {
				...options.blocks,
				channel: $channelList,
			};
		} else if (type === 'video') {
			options.blocks = {
				...options.blocks,
				video: $videoList,
			};
		}

		// 스토리지에 저장
		await chrome.storage.sync.set({ options });

		alert(t('options_saved'));

		// 버튼 상태 변경용
		updateOptionsPageData(type);
	}

	function handleCancelBlacklist(type) {
		updateOptionsPageData(type);
	}

	async function handleExportOptions() {
		// 스토리지에서 가져오기
		const { options } = await chrome.storage.sync.get('options');

		// 파일 다운로드 다이얼로그 띄우기
		const element = document.createElement('a');
		element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(JSON.stringify(options, null, 4)));
		element.setAttribute('download', 'youtube-blacklist-options.json');
		element.style.display = 'none';
		document.body.appendChild(element);
		element.click();
		document.body.removeChild(element);
	}

	function validFileType(file) {
		return file.type === 'application/json';
	}

	async function handleImportOptions() {
		if (inputFileOptions.files.length === 0) {
			// 선택된 파일이 없음.
			return;
		}

		const currentFile = inputFileOptions.files[0];
		if (validFileType(currentFile) === false) {
			// json 타입이 아님.
			return;
		}

		// 파일 열기
		const reader = new FileReader();
		reader.onload = async () => {
			try {
				const options = await updateOptionsPageData();

				const newOptions = JSON.parse(reader.result);

				if (newOptions?.blocks === undefined) {
					throw new Error(t('invalid_json'));
				}

				if (newOptions.blocks.channel === undefined || Array.isArray(newOptions.blocks.channel) === false) {
					// 채널 목록이 존재하는지 확인
					throw new Error(t('invalid_json_channel'));
				} else {
					// 채널 목록의 아이템이 형식을 갖췃는지 확인
					for (const info of newOptions.blocks.channel) {
						if (info.type !== 'channel' || typeof info.name !== 'string' || typeof info.url !== 'string') {
							throw new Error(t('invalid_json_channel_item'));
						}
					}
				}

				if (newOptions.blocks.video === undefined || Array.isArray(newOptions.blocks.video) === false) {
					// 영상 목록이 존재하는지 확인
					throw new Error(t('invalid_json_video'));
				} else {
					// 영상 목록의 아이템이 형식을 갖췃는지 확인
					for (const info of newOptions.blocks.video) {
						if (info.type !== 'video' || typeof info.name !== 'string' || typeof info.url !== 'string') {
							throw new Error(t('invalid_json_video_item'));
						}
					}
				}

				// 기존 항목을 메시지로 변경
				let message = t('channels');
				for (const info of options.blocks.channel) {
					message = `${message}\n- ${info.name}`;
				}
				message = `${message}\n${t('videos')}:`;
				for (const info of options.blocks.video) {
					message = `${message}\n- ${info.name}`;
				}

				importDialogInfo.set({
					message: message,
					options: options,
					newOptions: newOptions,
				});
				openImportDialog.set(true);

				// getBlocklist();
			} catch (error) {
				// 옵션 파일 열기 실패
				alert(error);
			}

			inputFileOptions.value = '';
		};
		reader.readAsText(inputFileOptions.files[0]);
	}
</script>

<div class="box">
	<input type="file" accept=".json" bind:this={inputFileOptions} style="display: none;" on:change={handleImportOptions} />
	<div class="main-container">
		<div class="title-container" style="justify-content: space-between;">
			<span id="title">{t('youtube_blacklist_options')}</span>
			<div class="action-container">
				<Button variant="outlined" style="margin-left: 8px;" on:click={handleExportOptions}>
					<Label>{t('export')}</Label>
				</Button>
				<Button variant="outlined" style="margin-left: 8px;" on:click={() => inputFileOptions.click()}>
					<Label>{t('import')}</Label>
				</Button>
				<Button variant="outlined" style="margin-left: 8px;" on:click={updateOptionsPageData}>
					<Label>{t('refresh')}</Label>
				</Button>
			</div>
		</div>
		<Paper>
			<div class="title-container">{t('channel_list_to_block')}</div>
			<Separator />
			<div class="block-container">
				<List class="list">
					{#each $channelList as item, i}
						<Item class="item" title={item.name}>
							<Text>{item.name}</Text>
							<Meta
								class="material-icons"
								title={t('remove')}
								on:click={() => {
									// 배열에서 삭제
									const newList = $channelList;
									newList.splice(i, 1);
									channelList.set(newList);

									// 저장 가능
									buttonState.set({
										canSave: {
											...$buttonState.canSave,
											channel: true,
										},
										canCancel: {
											...$buttonState.canCancel,
											channel: true,
										},
									});
								}}
							>
								clear
							</Meta>
						</Item>
					{/each}
				</List>
			</div>
			<div class="action-container">
				<Button
					variant="raised"
					style="margin-left: 8px;"
					disabled={!$buttonState.canSave['channel']}
					on:click={() => {
						handleSaveBlacklist('channel');
					}}
				>
					<Label>{t('save')}</Label>
				</Button>
				<Button
					variant="outlined"
					style="margin-left: 16px;"
					disabled={!$buttonState.canCancel['channel']}
					on:click={() => {
						handleCancelBlacklist('channel');
					}}
				>
					<Label>{t('cancel')}</Label>
				</Button>
			</div>
		</Paper>
		<Paper style="margin-top: 16px;">
			<div class="title-container">{t('video_list_to_block')}</div>
			<Separator />
			<div class="block-container">
				<List class="list">
					{#each $videoList as item, i}
						<Item class="item" title={item.name}>
							<Text>{item.name}</Text>
							<Meta
								class="material-icons"
								title={t('remove')}
								on:click={() => {
									// 배열에서 삭제
									const newList = $videoList;
									newList.splice(i, 1);
									videoList.set(newList);

									// 저장 가능
									buttonState.set({
										canSave: {
											...$buttonState.canSave,
											video: true,
										},
										canCancel: {
											...$buttonState.canCancel,
											video: true,
										},
									});
								}}
							>
								clear
							</Meta>
						</Item>
					{/each}
				</List>
			</div>
			<div class="action-container">
				<Button
					variant="raised"
					style="margin-left: 8px;"
					disabled={!$buttonState.canSave['video']}
					on:click={() => {
						handleSaveBlacklist('video');
					}}
				>
					<Label>{t('save')}</Label>
				</Button>
				<Button
					variant="outlined"
					style="margin-left: 16px;"
					disabled={!$buttonState.canCancel['video']}
					on:click={() => {
						handleCancelBlacklist('video');
					}}
				>
					<Label>{t('cancel')}</Label>
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
		align-self: center;
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
