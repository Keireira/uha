import React from 'react';
import { Stack } from 'expo-router';

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
						autoFocus: true
					}
				}}
			/>
		</Stack>
	);
};

export default Layout;
