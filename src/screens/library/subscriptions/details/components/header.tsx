import React from 'react';
import { Stack, useRouter } from 'expo-router';

import { useAccent } from '@hooks';
import { useSaveSubscription } from '../hooks';

import type { ServiceT, SubscriptionT } from '@models';

type Props = {
	subscription: SubscriptionT;
	service: ServiceT;
	headerTitle: string;
};

const Header = ({ subscription, service, headerTitle }: Props) => {
	const router = useRouter();
	const settingAccent = useAccent();

	const saveSubscription = useSaveSubscription();

	const closeModal = () => {
		router.back();
	};

	const save = () => {
		saveSubscription(subscription, service);
	};

	return (
		<>
			<Stack.Toolbar placement="left">
				<Stack.Toolbar.Button variant="plain" icon="xmark" onPress={closeModal} />
			</Stack.Toolbar>

			<Stack.Screen options={{ title: headerTitle }} />

			<Stack.Toolbar placement="right">
				<Stack.Toolbar.Button variant="done" icon="checkmark" onPress={save} tintColor={settingAccent} />
			</Stack.Toolbar>
		</>
	);
};

export default Header;
