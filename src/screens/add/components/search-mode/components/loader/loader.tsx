import React from 'react';
import { useSettingsValue } from '@hooks';
import { useTheme } from 'styled-components/native';

import { ActivityIndicator } from 'react-native';
import Root from './loader.styles';

import type { AccentT } from '@themes';

const Loader = () => {
	const theme = useTheme();
	const settingAccent = useSettingsValue<AccentT>('accent');

	return (
		<Root>
			<ActivityIndicator size="large" color={theme.accents[settingAccent]} />
		</Root>
	);
};

export default Loader;
