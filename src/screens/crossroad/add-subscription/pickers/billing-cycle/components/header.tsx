import React from 'react';
import { Stack, useRouter } from 'expo-router';

import { useAccent } from '@hooks';

const Header = () => {
	const router = useRouter();
	const settingAccent = useAccent();

	const confirm = () => {
		router.back();
	};

	return (
		<Stack.Toolbar placement="right">
			<Stack.Toolbar.Button variant="done" icon="checkmark" onPress={confirm} tintColor={settingAccent} />
		</Stack.Toolbar>
	);
};

export default Header;
