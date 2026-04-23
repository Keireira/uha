import React from 'react';
import { Stack, useRouter } from 'expo-router';

import { useAccent } from '@hooks';
import { useDraftStore } from '@screens/crossroad/add-subscription/hooks';

const Header = () => {
	const router = useRouter();
	const settingAccent = useAccent();
	const syncFirstPaymentToTrial = useDraftStore((state) => state.actions.syncFirstPaymentToTrial);

	const confirm = () => {
		router.back();
	};

	return (
		<>
			<Stack.Toolbar placement="left">
				<Stack.Toolbar.Menu icon="ellipsis" tintColor={settingAccent}>
					<Stack.Toolbar.MenuAction
						onPress={syncFirstPaymentToTrial}
						subtitle="You can move the FPD to today plus a selected duration"
					>
						Adjust first payment date
					</Stack.Toolbar.MenuAction>
				</Stack.Toolbar.Menu>
			</Stack.Toolbar>

			<Stack.Toolbar placement="right">
				<Stack.Toolbar.Button variant="done" icon="checkmark" onPress={confirm} tintColor={settingAccent} />
			</Stack.Toolbar>
		</>
	);
};

export default Header;
