import { default as withAppleSettings, RadioGroup, ChildPane } from '@config-plugins/apple-settings';

import type { ExpoConfig, ConfigContext } from 'expo/config';

const appConfig = ({ config }: ConfigContext): ExpoConfig => {
	return withAppleSettings(config as ExpoConfig, {
		Root: {
			locales: {
				en: {
					Theme: 'Theme'
				},
				ru: {
					Theme: 'Тема'
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
};

export default appConfig;
