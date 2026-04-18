import React, { useEffect } from 'react';
import { Stack, useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { useAccent } from '@hooks';
import { useLoadService, useNewSubStore } from './hooks';

import MasterPane from './master-pane';
import Root from './add-subscription.styles';

const AddSubscriptionScreen = () => {
	const router = useRouter();
	const settingAccent = useAccent();
	const insets = useSafeAreaInsets();
	const { service, isLoading } = useLoadService();
	const initSubscription = useNewSubStore((state) => state.actions.init);

	useEffect(() => {
		if (isLoading || !service) return;

		initSubscription({
			...service,
			color: service.color || settingAccent
		});
	}, [initSubscription, service, settingAccent, isLoading]);

	if (isLoading) {
		return null;
	}

	return (
		<Root
			contentContainerStyle={{
				paddingTop: 24,
				paddingHorizontal: 24,
				paddingBottom: insets.bottom + 24
			}}
		>
			<Stack.Toolbar placement="left">
				<Stack.Toolbar.Button
					icon="xmark"
					onPress={() => {
						router.back();
					}}
					variant="plain"
					tintColor={settingAccent}
				/>
			</Stack.Toolbar>

			<MasterPane />

			<Stack.Toolbar placement="bottom">
				<Stack.Toolbar.Button
					onPress={() => {
						console.log('++');
					}}
					tintColor={settingAccent}
				>
					Create Subscription
				</Stack.Toolbar.Button>
			</Stack.Toolbar>
		</Root>
	);
};

export default AddSubscriptionScreen;
