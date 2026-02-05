import i18n from 'i18next';
import { setDefaultOptions } from 'date-fns';
import { initReactI18next } from 'react-i18next';
import * as Localization from 'expo-localization';

import english from '@locales/en.json';
import russian from '@locales/ru.json';
import kazakh from '@locales/kk.json';
import { enUS, ru, kk } from 'date-fns/locale';

const resources = {
	en: { translation: english },
	ru: { translation: russian },
	kk: { translation: kazakh }
};

const dateFnsLocales = {
	en: enUS,
	ru: ru,
	kk: kk
};

const initI18n = () => {
	const langCode = Localization.getLocales()[0].languageCode ?? 'en';

	i18n.use(initReactI18next).init({
		resources,
		lng: langCode,
		fallbackLng: 'en',
		supportedLngs: ['en', 'ru', 'kk'],
		interpolation: {
			escapeValue: false
		}
	});

	setDefaultOptions({
		locale: dateFnsLocales[langCode as keyof typeof dateFnsLocales]
	});

	// i18n.on('languageChanged', (lng) => {
	// 	setDefaultOptions({
	// 		locale: dateFnsLocales[langCode as keyof typeof dateFnsLocales]
	// 	});
	// });
};

initI18n();

export default i18n;
