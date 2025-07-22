import React from 'react';
import { Stack } from 'expo-router';

const Layout = () => (
	<Stack>
		<Stack.Screen name="index" options={{ headerShown: false, animation: 'none' }} />
		<Stack.Screen name="categories-list" options={{ headerShown: false }} />
		<Stack.Screen name="services-list" options={{ headerShown: false }} />
		<Stack.Screen name="payments-list" options={{ headerShown: false }} />
	</Stack>
);

export default Layout;
