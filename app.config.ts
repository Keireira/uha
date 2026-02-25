import { default as withAppleSettings, RadioGroup, ChildPane } from '@config-plugins/apple-settings';

import type { ExpoConfig, ConfigContext } from 'expo/config';

const appConfig = ({ config }: ConfigContext): ExpoConfig => {
	const modifiedConfig = withAppleSettings(config as ExpoConfig, {
		Root: {
			locales: {
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
				}
			},
			page: {
				PreferenceSpecifiers: [
					ChildPane({
						title: 'Theme'
					})
				]
			}
		},
		Theme: {
			locales: {
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
				}
			},
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
