import appleSettings, { ChildPane, RadioGroup } from '@config-plugins/apple-settings';

import type { ConfigContext, ExpoConfig } from 'expo/config';

const withAppleSettings = typeof appleSettings === 'function' ? appleSettings : appleSettings.default;

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
	ja: {
		Theme: 'テーマ'
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
	ja: {
		Theme: 'テーマ',
		UseDeviceAppearance: 'デバイスの外観を使用',
		Light: 'ライト',
		Dark: 'ダーク'
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
