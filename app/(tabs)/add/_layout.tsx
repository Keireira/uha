import React, { useCallback, useRef } from 'react';
import { Stack, useFocusEffect } from 'expo-router';
import { useSearch } from '@screens/add';

import type { SearchBarCommands } from 'react-native-screens';

const Layout = () => {
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
					title: 'Find new Service',
					headerTitleStyle: {
						color: 'transparent'
					},
					headerShown: true,
					headerTransparent: true,
					headerShadowVisible: false,
					headerSearchBarOptions: {
						ref: searchBarRef,
						hideNavigationBar: false,
						placeholder: 'Search service to add',
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
