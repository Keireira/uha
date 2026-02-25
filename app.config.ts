import { default as withAppleSettings, RadioGroup, ChildPane } from '@config-plugins/apple-settings';

import type { ExpoConfig, ConfigContext } from 'expo/config';

const localesTopLevel = {
	en: {
		Theme: 'Theme'
	},
	ru: {
		Theme: 'Тема'
	},
	kk: {
		Theme: 'Сыртқы түр'
	},
	es: {
		Theme: 'Tema'
	},
	'pt-BR': {
		Theme: 'Tema'
	},
	de: {
		Theme: 'Design'
	},
	ja: {
		Theme: 'テーマ'
	},
	fr: {
		Theme: 'Thème'
	},
	ko: {
		Theme: '테마'
	},
	it: {
		Theme: 'Tema'
	},
	pl: {
		Theme: 'Motyw'
	},
	uk: {
		Theme: 'Тема'
	},
	ka: {
		Theme: 'თემა'
	},
	bg: {
		Theme: 'Тема'
	},
	cs: {
		Theme: 'Motiv'
	},
	da: {
		Theme: 'Tema'
	},
	el: {
		Theme: 'Θέμα'
	},
	fi: {
		Theme: 'Teema'
	},
	fil: {
		Theme: 'Tema'
	},
	hi: {
		Theme: 'थीम'
	},
	hu: {
		Theme: 'Téma'
	},
	is: {
		Theme: 'Þema'
	},
	nb: {
		Theme: 'Tema'
	},
	nl: {
		Theme: 'Thema'
	},
	ro: {
		Theme: 'Temă'
	},
	sk: {
		Theme: 'Motív'
	},
	sr: {
		Theme: 'Тема'
	},
	sv: {
		Theme: 'Tema'
	},
	th: {
		Theme: 'ธีม'
	},
	vi: {
		Theme: 'Giao diện'
	},
	'zh-Hans': {
		Theme: '主题'
	},
	'zh-Hant': {
		Theme: '主題'
	}
};

const localesConfig = {
	en: {
		Theme: 'Theme',
		UseDeviceAppearance: 'Use device appearance',
		Light: 'Light',
		Dark: 'Dark'
	},
	ru: {
		Theme: 'Тема',
		UseDeviceAppearance: 'Следовать системной теме',
		Light: 'Светлая',
		Dark: 'Тёмная'
	},
	kk: {
		Theme: 'Сыртқы түр',
		UseDeviceAppearance: 'Құрылғы көрінісін қолдану',
		Light: 'Жарық',
		Dark: 'Қараңғы'
	},
	es: {
		Theme: 'Tema',
		UseDeviceAppearance: 'Usar apariencia del dispositivo',
		Light: 'Claro',
		Dark: 'Oscuro'
	},
	'pt-BR': {
		Theme: 'Tema',
		UseDeviceAppearance: 'Usar aparência do dispositivo',
		Light: 'Claro',
		Dark: 'Escuro'
	},
	de: {
		Theme: 'Design',
		UseDeviceAppearance: 'Gerätedarstellung verwenden',
		Light: 'Hell',
		Dark: 'Dunkel'
	},
	ja: {
		Theme: 'テーマ',
		UseDeviceAppearance: 'デバイスの外観を使用',
		Light: 'ライト',
		Dark: 'ダーク'
	},
	fr: {
		Theme: 'Thème',
		UseDeviceAppearance: "Suivre l'apparence de l'appareil",
		Light: 'Clair',
		Dark: 'Sombre'
	},
	ko: {
		Theme: '테마',
		UseDeviceAppearance: '기기 설정 따르기',
		Light: '라이트',
		Dark: '다크'
	},
	it: {
		Theme: 'Tema',
		UseDeviceAppearance: 'Usa aspetto del dispositivo',
		Light: 'Chiaro',
		Dark: 'Scuro'
	},
	pl: {
		Theme: 'Motyw',
		UseDeviceAppearance: 'Użyj wyglądu urządzenia',
		Light: 'Jasny',
		Dark: 'Ciemny'
	},
	uk: {
		Theme: 'Тема',
		UseDeviceAppearance: 'Використовувати тему пристрою',
		Light: 'Світла',
		Dark: 'Темна'
	},
	ka: {
		Theme: 'თემა',
		UseDeviceAppearance: 'მოწყობილობის თემის გამოყენება',
		Light: 'ღია',
		Dark: 'მუქი'
	},
	bg: {
		Theme: 'Тема',
		UseDeviceAppearance: 'Използвай изглед на устройството',
		Light: 'Светла',
		Dark: 'Тъмна'
	},
	cs: {
		Theme: 'Motiv',
		UseDeviceAppearance: 'Použít vzhled zařízení',
		Light: 'Světlý',
		Dark: 'Tmavý'
	},
	da: {
		Theme: 'Tema',
		UseDeviceAppearance: 'Brug enhedens udseende',
		Light: 'Lys',
		Dark: 'Mørk'
	},
	el: {
		Theme: 'Θέμα',
		UseDeviceAppearance: 'Χρήση εμφάνισης συσκευής',
		Light: 'Φωτεινό',
		Dark: 'Σκοτεινό'
	},
	fi: {
		Theme: 'Teema',
		UseDeviceAppearance: 'Käytä laitteen ulkoasua',
		Light: 'Vaalea',
		Dark: 'Tumma'
	},
	fil: {
		Theme: 'Tema',
		UseDeviceAppearance: 'Gamitin ang hitsura ng device',
		Light: 'Maliwanag',
		Dark: 'Madilim'
	},
	hi: {
		Theme: 'थीम',
		UseDeviceAppearance: 'डिवाइस की थीम का उपयोग करें',
		Light: 'लाइट',
		Dark: 'डार्क'
	},
	hu: {
		Theme: 'Téma',
		UseDeviceAppearance: 'Eszköz megjelenésének használata',
		Light: 'Világos',
		Dark: 'Sötét'
	},
	is: {
		Theme: 'Þema',
		UseDeviceAppearance: 'Nota útlit tækis',
		Light: 'Ljóst',
		Dark: 'Dökkt'
	},
	nb: {
		Theme: 'Tema',
		UseDeviceAppearance: 'Bruk enhetens utseende',
		Light: 'Lys',
		Dark: 'Mørk'
	},
	nl: {
		Theme: 'Thema',
		UseDeviceAppearance: 'Gebruik apparaatweergave',
		Light: 'Licht',
		Dark: 'Donker'
	},
	ro: {
		Theme: 'Temă',
		UseDeviceAppearance: 'Folosește aspectul dispozitivului',
		Light: 'Deschisă',
		Dark: 'Întunecată'
	},
	sk: {
		Theme: 'Motív',
		UseDeviceAppearance: 'Použiť vzhľad zariadenia',
		Light: 'Svetlý',
		Dark: 'Tmavý'
	},
	sr: {
		Theme: 'Тема',
		UseDeviceAppearance: 'Користи изглед уређаја',
		Light: 'Светла',
		Dark: 'Тамна'
	},
	sv: {
		Theme: 'Tema',
		UseDeviceAppearance: 'Använd enhetens utseende',
		Light: 'Ljust',
		Dark: 'Mörkt'
	},
	th: {
		Theme: 'ธีม',
		UseDeviceAppearance: 'ใช้รูปลักษณ์ของอุปกรณ์',
		Light: 'สว่าง',
		Dark: 'มืด'
	},
	vi: {
		Theme: 'Giao diện',
		UseDeviceAppearance: 'Sử dụng giao diện thiết bị',
		Light: 'Sáng',
		Dark: 'Tối'
	},
	'zh-Hans': {
		Theme: '主题',
		UseDeviceAppearance: '跟随系统外观',
		Light: '浅色',
		Dark: '深色'
	},
	'zh-Hant': {
		Theme: '主題',
		UseDeviceAppearance: '跟隨系統外觀',
		Light: '淺色',
		Dark: '深色'
	}
};

const appConfig = ({ config }: ConfigContext): ExpoConfig => {
	const modifiedConfig = withAppleSettings(config as ExpoConfig, {
		Root: {
			locales: localesTopLevel,
			page: {
				PreferenceSpecifiers: [
					ChildPane({
						title: 'Theme'
					})
				]
			}
		},
		Theme: {
			locales: localesConfig,
			page: {
				PreferenceSpecifiers: [
					RadioGroup({
						title: 'Theme',
						key: 'theme',
						value: 'system',
						items: [
							{ title: 'UseDeviceAppearance', value: 'system' },
							{ title: 'Light', value: 'light' },
							{ title: 'Dark', value: 'dark' }
						]
					})
				]
			}
		}
	});

	return modifiedConfig;
};

export default appConfig;
