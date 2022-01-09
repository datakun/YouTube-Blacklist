<script>
	import { dialogInfo, openDialog } from '../contentStore';

	export let type = 'channel';
	export let label = '';
	export let blockName = '';
	export let blockUrl = '';
	export let imageSrc = '';

	// 열었던 드랍다운 메뉴 숨기기
	function hideDropdownMenu() {
		const dropdown = document.querySelector('tp-yt-iron-dropdown');
		if (dropdown) {
			dropdown.style.display = 'none';
		}
	}

	// 차단 다이얼로그 열기
	function openBlockDialog(_blockInfo) {
		// 스토어에 변경
		dialogInfo.set(_blockInfo);

		// 다이얼로그 띄우기
		openDialog.set(true);
	}

	// 클릭한 아이템 차단하기
	function handleClickBlockItem(e) {
		e.preventDefault();
		e.stopPropagation();

		// 드랍다운 메뉴 숨기기
		hideDropdownMenu();

		if (blockName !== '' && blockUrl !== '') {
			const blockInfo = {
				type: type,
				name: blockName,
				image: imageSrc,
				url: blockUrl,
			};

			openBlockDialog(blockInfo);
		}
	}
</script>

<div class="datakun-ytb-menu datakun-ytb-block-{type}" role="menuitem" aria-selected="false" tabindex="-1" on:click={handleClickBlockItem}>
	{label}
</div>

<style>
	.datakun-ytb-menu {
		display: flex;
		align-items: center;
		height: 36px;
		padding-left: 16px;
		font-size: 14px;
		cursor: pointer;
	}
</style>
