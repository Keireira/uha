import { useEffect, useState } from 'react';
import { AppState, Appearance, type ColorSchemeName } from 'react-native';
import { useSettingsValue } from '@hooks';
import SettingsBridgeModule from '@modules/settings-bridge';
import darkTheme from './dark';
import lightTheme from './light';
import oledTheme from './oled';

type ResolvedColorScheme = 'light' | 'dark';

const normalizeColorScheme = (colorScheme: ColorSchemeName | null): ResolvedColorScheme | undefined => {
	if (colorScheme === 'light' || colorScheme === 'dark') {
		return colorScheme;
	}
};

const getSystemColorScheme = (): ResolvedColorScheme => {
	return (
		normalizeColorScheme(SettingsBridgeModule.getColorScheme()) ??
		normalizeColorScheme(Appearance.getColorScheme()) ??
		'light'
	);
};

const useGetTheme = () => {
	const [systemColorScheme, setSystemColorScheme] = useState<ResolvedColorScheme>(getSystemColorScheme);
	const isOledTheme = useSettingsValue<boolean>('oled_mode');
	const theme = useSettingsValue<'auto' | 'dark' | 'light'>('theme');
	const resolvedTheme = theme === 'auto' ? systemColorScheme : theme;

	useEffect(() => {
		const appearanceSubscription = Appearance.addChangeListener(({ colorScheme }) => {
			setSystemColorScheme(normalizeColorScheme(colorScheme) ?? 'light');
		});

		const bridgeSubscription = SettingsBridgeModule.addListener('onThemeChanged', ({ newValue }) => {
			if (newValue) {
				setSystemColorScheme(newValue);
			}
		});

		const appStateSubscription = AppState.addEventListener('change', (state) => {
			if (state === 'active') {
				setSystemColorScheme(getSystemColorScheme());
			}
		});

		setSystemColorScheme(getSystemColorScheme());

		return () => {
			appearanceSubscription.remove();
			bridgeSubscription.remove();
			appStateSubscription.remove();
		};
	}, []);

	if (resolvedTheme === 'dark') {
		return isOledTheme ? oledTheme : darkTheme;
	}

	return lightTheme;
};

export default useGetTheme;
