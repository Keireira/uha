import React from 'react';
import { Stack } from 'expo-router';

const Layout = () => (
	<Stack>
		<Stack.Screen
			name="index"
			options={{ headerShown: false, headerTransparent: true }}
			initialParams={{ tx_view_mode: 'list' }}
		/>
		<Stack.Screen name="[transactionId]" options={{ headerShown: false }} />
	</Stack>
);

export default Layout;
