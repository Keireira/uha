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
	const actions = useNewSubStore((state) => state.actions);

	useEffect(() => {
		if (isLoading || !service) return;

		actions.init(service);
		// actions.setDefaultLogo({ title: service.title, color: service.color, logo_url: service.logo_url });
	}, [service, isLoading]);

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
