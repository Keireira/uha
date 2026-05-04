import React, { useCallback, useRef } from 'react';
import { Stack, useFocusEffect } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { useTheme } from 'styled-components/native';

import { useSearch } from '@screens/search/hooks';

import type { SearchBarCommands } from 'react-native-screens';

const Layout = () => {
	const theme = useTheme();
	const { t } = useTranslation();
	const { runSearch } = useSearch();
	const searchBarRef = useRef<SearchBarCommands>(null);

	const focusSearchBar = useCallback(() => {
		if (!searchBarRef.current) return;

		searchBarRef.current?.focus();
	}, []);

	useFocusEffect(focusSearchBar);

	return (
		<Stack>
			<Stack.Screen
				name="index"
				options={{
					title: t('crossroad.search.header'),
					headerTitleStyle: {
						color: 'transparent'
					},
					headerShown: true,
					headerTransparent: true,
					headerShadowVisible: false,
					contentStyle: {
						backgroundColor: theme.background.default
					},
					headerSearchBarOptions: {
						ref: searchBarRef,
						hideNavigationBar: false,
						placeholder: t('crossroad.search.search_bar'),
						onChangeText: (e) => {
							runSearch(e.nativeEvent.text);
						}
					}
				}}
			/>
		</Stack>
	);
};

export default Layout;
