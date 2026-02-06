import React from 'react';
import { Stack } from 'expo-router';
import { useTheme } from 'styled-components/native';

const formSheetOptions = (backgroundColor: string) => ({
	headerShown: false,
	gestureEnabled: true,
	presentation: 'formSheet' as const,
	sheetAllowedDetents: [0.55, 0.92],
	sheetLargestUndimmedDetentIndex: 'none' as const,
	sheetGrabberVisible: true,
	sheetCornerRadius: -1,
	animation: 'slide_from_bottom' as const,
	contentStyle: { backgroundColor }
});

const Layout = () => {
	const theme = useTheme();
	const sheetOptions = formSheetOptions(theme.background.secondary);

	return (
		<Stack>
			<Stack.Screen name="index" options={{ headerShown: false, animation: 'none' }} />
			<Stack.Screen name="categories-list" options={{ headerShown: false }} />
			<Stack.Screen name="services-list" options={{ headerShown: false }} />
			<Stack.Screen name="payments-list" options={{ headerShown: false }} />
			<Stack.Screen name="[id]" options={sheetOptions} />
		</Stack>
	);
};

export default Layout;
