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
import bulgarian from '@locales/bg.json';
import czech from '@locales/cs.json';
import danish from '@locales/da.json';
import greek from '@locales/el.json';
import finnish from '@locales/fi.json';
import filipino from '@locales/fil.json';
import hindi from '@locales/hi.json';
import hungarian from '@locales/hu.json';
import icelandic from '@locales/is.json';
import norwegian from '@locales/nb.json';
import dutch from '@locales/nl.json';
import romanian from '@locales/ro.json';
import slovak from '@locales/sk.json';
import serbian from '@locales/sr.json';
import swedish from '@locales/sv.json';
import thai from '@locales/th.json';
import vietnamese from '@locales/vi.json';
import chineseSimplified from '@locales/zh-Hans.json';
import chineseTraditional from '@locales/zh-Hant.json';
import {
	enUS, ru, kk, es, ptBR, de, ja, fr, ko, it, pl, uk, ka,
	bg, cs, da, el, fi, hi, hu, is, nb, nl, ro, sk, sr, sv, th, vi, zhCN, zhTW
} from 'date-fns/locale';

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
	ka: { translation: georgian },
	bg: { translation: bulgarian },
	cs: { translation: czech },
	da: { translation: danish },
	el: { translation: greek },
	fi: { translation: finnish },
	fil: { translation: filipino },
	hi: { translation: hindi },
	hu: { translation: hungarian },
	is: { translation: icelandic },
	nb: { translation: norwegian },
	nl: { translation: dutch },
	ro: { translation: romanian },
	sk: { translation: slovak },
	sr: { translation: serbian },
	sv: { translation: swedish },
	th: { translation: thai },
	vi: { translation: vietnamese },
	'zh-Hans': { translation: chineseSimplified },
	'zh-Hant': { translation: chineseTraditional }
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
	ka: ka,
	bg: bg,
	cs: cs,
	da: da,
	el: el,
	fi: fi,
	fil: enUS,
	hi: hi,
	hu: hu,
	is: is,
	nb: nb,
	nl: nl,
	ro: ro,
	sk: sk,
	sr: sr,
	sv: sv,
	th: th,
	vi: vi,
	'zh-Hans': zhCN,
	'zh-Hant': zhTW
};

const initI18n = () => {
	const langCode = Localization.getLocales()[0].languageCode ?? 'en';

	i18n.use(initReactI18next).init({
		resources,
		lng: langCode,
		fallbackLng: 'en',
		supportedLngs: [
			'en', 'ru', 'kk', 'es', 'pt-BR', 'de', 'ja', 'fr', 'ko', 'it', 'pl', 'uk', 'ka',
			'bg', 'cs', 'da', 'el', 'fi', 'fil', 'hi', 'hu', 'is', 'nb', 'nl', 'ro',
			'sk', 'sr', 'sv', 'th', 'vi', 'zh-Hans', 'zh-Hant'
		],
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
