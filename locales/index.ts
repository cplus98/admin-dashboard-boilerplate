import _ from 'lodash';
import { useCallback } from 'react';
import i18next from 'i18next';
import { initReactI18next, useTranslation } from 'react-i18next';
import { useAppSettings, getAppSettings } from '@utils/settings';
import { useGlobalStore } from 'app';
import { defaultLanguage, resources, nativeName } from './locales';

export const initLocalization = () => {
	let lng = defaultLanguage;
	const settingsData = getAppSettings();
	if (settingsData) {
		const settings = JSON.parse(settingsData);
		if (_.keys(resources).includes(settings.languageTag)) {
			lng = settings.languageTag;
		}
	}
	i18next.use(initReactI18next).init({
		lng,
		debug: process.env.DEBUG === 'true',
		fallbackLng: ['en-US', 'es', 'fr', 'dev'],
		resources,
	});
};

export const useLocalization = () => {
	const { setSettings } = useAppSettings();
	const { t, ready } = useTranslation();

	const changeLanguage = useCallback(
		(language: string) => {
			if (_.isEqual(language, '')) {
				// Reset language
				setSettings((s: any) => {
					const newOption = _.omit(s, 'languageTag');
					return newOption;
				});
				i18next.changeLanguage(defaultLanguage);
				return;
			}

			if (_.keys(resources).includes(language)) {
				setSettings((s: any) => {
					const newOption = _.merge({}, s, { languageTag: language });
					return newOption;
				});
				i18next.changeLanguage(language);
			}
		},
		[setSettings],
	);

	return { language: i18next.language, languages: i18next.languages, changeLanguage, t, ready };
};

export const getNativeName = (languageTag: string): string | undefined => _.find(nativeName, languageTag);

export default i18next;
