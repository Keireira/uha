import i18n from 'i18next';
import { setDefaultOptions } from 'date-fns';
import { initReactI18next } from 'react-i18next';
import * as Localization from 'expo-localization';

import { enUS, ru, kk, es, ja } from 'date-fns/locale';
import { english, russian, kazakh, spanish, japanese } from '@locales';

const resources = {
	en: { translation: english },
	ru: { translation: russian },
	kk: { translation: kazakh },
	es: { translation: spanish },
	ja: { translation: japanese }
};

const dateFnsLocales = {
	en: enUS,
	ru: ru,
	kk: kk,
	es: es,
	ja: ja
};

const initI18n = () => {
	const langCode = Localization.getLocales()[0].languageCode ?? 'en';

	i18n.use(initReactI18next).init({
		resources,
		lng: langCode,
		fallbackLng: 'en',
		supportedLngs: ['en', 'ru', 'kk', 'es', 'ja'],
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
