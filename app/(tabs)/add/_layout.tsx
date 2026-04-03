import React from 'react';
import { Stack } from 'expo-router';
import { searchCallbackRef } from '@screens/add/search-callback';

const Layout = () => {
	return (
		<Stack>
			<Stack.Screen
				name="index"
				options={{
					title: '—',
					headerTitleStyle: {
						color: 'transparent'
					},
					headerShown: true,
					headerTransparent: true,
					headerShadowVisible: false,
					headerSearchBarOptions: {
						placeholder: 'Search service to add',
						autoFocus: true,
						onChangeText: (e) => searchCallbackRef.current(e.nativeEvent.text),
						onCancelButtonPress: () => searchCallbackRef.current('')
					}
				}}
			/>
		</Stack>
	);
};

export default Layout;
