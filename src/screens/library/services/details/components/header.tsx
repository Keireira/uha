import React from 'react';
import { Stack, useRouter } from 'expo-router';

import { useAccent } from '@hooks';
import { useSaveService } from '@screens/library/services/details/hooks';

import type { ServiceT } from '@models';
import type { ServiceEditParams } from '@screens/library/services';

type Props = {
	initDraft: ServiceT;
	draft: ServiceEditParams;
};

const Header = ({ initDraft, draft }: Props) => {
	const router = useRouter();
	const settingAccent = useAccent();

	const saveService = useSaveService();

	const closeModal = () => {
		router.back();
	};

	const save = () => {
		saveService(initDraft, draft);
	};

	return (
		<>
			<Stack.Toolbar placement="left">
				<Stack.Toolbar.Button variant="plain" icon="xmark" onPress={closeModal} />
			</Stack.Toolbar>

			<Stack.Screen options={{ title: draft.title || initDraft.title }} />

			<Stack.Toolbar placement="right">
				<Stack.Toolbar.Button variant="done" icon="checkmark" onPress={save} tintColor={settingAccent} />
			</Stack.Toolbar>
		</>
	);
};

export default Header;
