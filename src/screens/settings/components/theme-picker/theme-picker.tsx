import React, { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useTheme } from 'styled-components/native';
import { setSettingsValue, useSettingsValue } from '@hooks';

import { H6 } from '@ui';
import { SymbolView } from 'expo-symbols';
import Root, { Tile, InnerTile } from './theme-picker.styles';

import type { UserT } from '@models';
import type { ModeT } from './theme-picker.d';

const MODES: ModeT[] = [
	{
		mode: 'light',
		icon: 'sun.max.fill',
		labelKey: 'settings.appearance.light',
		bg: '#ffffff',
		text: '#1C1C1E',
		colorScheme: 'light'
	},
	{
		mode: 'dark',
		icon: 'moon.fill',
		labelKey: 'settings.appearance.dark',
		bg: '#1c1c1e',
		text: '#fafafa',
		colorScheme: 'dark'
	},
	{
		mode: 'oled',
		icon: 'moon.stars.fill',
		labelKey: 'settings.appearance.oled',
		bg: '#000000',
		text: '#ffffff',
		colorScheme: 'dark'
	}
];

const ThemePicker = () => {
	const theme = useTheme();
	const { t } = useTranslation();

	const currentTheme = useSettingsValue<UserT['theme']>('theme');
	const selectedAccent = useSettingsValue<UserT['accent']>('accent');
	const isOledEnabled = useSettingsValue<UserT['oled_mode']>('oled_mode');
	const activeMode = isOledEnabled && currentTheme === 'dark' ? 'oled' : currentTheme;

	const accent = useMemo(() => {
		return theme.accents[selectedAccent] || theme.accents.orange;
	}, [theme, selectedAccent]);

	return (
		<Root>
			{MODES.map((mode) => {
				const isActive = activeMode === mode.mode;

				const selectTheme = () => {
					setSettingsValue('oled_mode', mode.mode === 'oled');
					setSettingsValue('theme', mode.mode === 'oled' ? 'dark' : mode.mode);
				};

				return (
					<Tile
						key={mode.mode}
						colorScheme={mode.colorScheme}
						isInteractive
						$accent={accent}
						$bg={mode.bg}
						$isActive={isActive}
					>
						<InnerTile onPress={selectTheme}>
							<SymbolView
								name="sun.max.fill"
								size={28}
								tintColor={isActive ? theme.accents[selectedAccent] : mode.text}
							/>

							<H6 $color={mode.text}>{t(mode.labelKey)}</H6>
						</InnerTile>
					</Tile>
				);
			})}
		</Root>
	);
};

export default ThemePicker;
