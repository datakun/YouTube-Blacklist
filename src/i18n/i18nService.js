import { _, addMessages, init, getLocaleFromNavigator } from 'svelte-i18n';

import ko from './ko.json';
import en from './en.json';

addMessages('en', en);
addMessages('ko', ko);

export function i18nService() {
	init({
		fallbackLocale: 'en', // default locale
		initialLocale: getLocaleFromNavigator(), // get locale from navigator
	});
}
