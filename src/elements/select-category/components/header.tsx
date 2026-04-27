import React from 'react';
import { useAccent } from '@hooks';
import * as Haptics from 'expo-haptics';
import { Stack, useRouter } from 'expo-router';

const Header = () => {
	const router = useRouter();
	const settingAccent = useAccent();

	const onCreateHd = () => {
		Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);

		router.push('/(crossroad)/add-category');
	};

	const onConfirmHd = () => {
		router.back();
	};

	return (
		<>
			<Stack.Toolbar placement="left">
				<Stack.Toolbar.Button
					variant="plain"
					icon="plus"
					accessibilityLabel="Create new category"
					onPress={onCreateHd}
					tintColor={settingAccent}
				/>
			</Stack.Toolbar>

			<Stack.Toolbar placement="right">
				<Stack.Toolbar.Button
					variant="done"
					icon="checkmark"
					accessibilityLabel="Close the picker"
					onPress={onConfirmHd}
					tintColor={settingAccent}
				/>
			</Stack.Toolbar>
		</>
	);
};

export default Header;
