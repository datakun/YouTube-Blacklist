class ChromeApi {
	openSnackbar(message) {
		chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
			chrome.tabs.sendMessage(tabs[0].id, { action: 'open_snackbar', message: message });
		});
	}
}

export default new ChromeApi();
