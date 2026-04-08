import React from 'react';
import { useAccent } from '@hooks';
import { Stack, useRouter } from 'expo-router';

const Header = () => {
	const router = useRouter();
	const settingAccent = useAccent();

	return (
		<Stack.Toolbar placement="right">
			<Stack.Toolbar.Button icon="checkmark" onPress={() => router.back()} variant="done" tintColor={settingAccent} />
		</Stack.Toolbar>
	);
};

export default Header;
