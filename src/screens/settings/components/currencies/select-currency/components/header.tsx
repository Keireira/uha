import React from 'react';
import { useSettingsValue } from '@hooks';
import { useTheme } from 'styled-components/native';
import { Stack, useRouter } from 'expo-router';

import type { AccentT } from '@themes';

const Header = () => {
	const theme = useTheme();
	const router = useRouter();
	const settingAccent = useSettingsValue<AccentT>('accent');

	return (
		<Stack.Toolbar placement="right">
			<Stack.Toolbar.Button
				icon="checkmark"
				onPress={() => router.back()}
				variant="done"
				tintColor={theme.accents[settingAccent]}
			/>
		</Stack.Toolbar>
	);
};

export default Header;
