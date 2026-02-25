import i18n from 'i18next';
import { setDefaultOptions } from 'date-fns';
import { initReactI18next } from 'react-i18next';
import * as Localization from 'expo-localization';

import english from '@locales/en.json';
import russian from '@locales/ru.json';
import kazakh from '@locales/kk.json';
import spanish from '@locales/es.json';
import portuguese from '@locales/pt-BR.json';
import german from '@locales/de.json';
import japanese from '@locales/ja.json';
import french from '@locales/fr.json';
import korean from '@locales/ko.json';
import italian from '@locales/it.json';
import polish from '@locales/pl.json';
import ukrainian from '@locales/uk.json';
import georgian from '@locales/ka.json';
import { enUS, ru, kk, es, ptBR, de, ja, fr, ko, it, pl, uk, ka } from 'date-fns/locale';

const resources = {
	en: { translation: english },
	ru: { translation: russian },
	kk: { translation: kazakh },
	es: { translation: spanish },
	'pt-BR': { translation: portuguese },
	de: { translation: german },
	ja: { translation: japanese },
	fr: { translation: french },
	ko: { translation: korean },
	it: { translation: italian },
	pl: { translation: polish },
	uk: { translation: ukrainian },
	ka: { translation: georgian }
};

const dateFnsLocales = {
	en: enUS,
	ru: ru,
	kk: kk,
	es: es,
	'pt-BR': ptBR,
	de: de,
	ja: ja,
	fr: fr,
	ko: ko,
	it: it,
	pl: pl,
	uk: uk,
	ka: ka
};

const initI18n = () => {
	const langCode = Localization.getLocales()[0].languageCode ?? 'en';

	i18n.use(initReactI18next).init({
		resources,
		lng: langCode,
		fallbackLng: 'en',
		supportedLngs: ['en', 'ru', 'kk', 'es', 'pt-BR', 'de', 'ja', 'fr', 'ko', 'it', 'pl', 'uk', 'ka'],
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
