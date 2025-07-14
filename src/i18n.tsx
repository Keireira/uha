import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import * as Localization from 'expo-localization';

import english from '@locales/en.json';
import russian from '@locales/ru.json';

const resources = {
	en: { translation: english },
	ru: { translation: russian }
};

const initI18n = () => {
	i18n.use(initReactI18next).init({
		resources,
		lng: Localization.getLocales()[0].languageCode ?? 'en',
		fallbackLng: 'en',
		supportedLngs: ['en', 'ru'],
		interpolation: {
			escapeValue: false
		}
	});
};

initI18n();

export default i18n;
