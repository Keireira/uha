import React from 'react';
import { Stack, useRouter } from 'expo-router';

import { useAccent } from '@hooks';
import { useSavePayment } from '@screens/library/payments/details/hooks';

import type { TenderT } from '@models';
import type { PaymentEditParams } from '@screens/library/payments';

type Props = {
	initDraft: TenderT;
	draft: PaymentEditParams;
};

const Header = ({ initDraft, draft }: Props) => {
	const router = useRouter();
	const settingAccent = useAccent();

	const savePayment = useSavePayment();

	const closeModal = () => {
		router.back();
	};

	const save = () => {
		if (!initDraft) return;

		savePayment(initDraft, draft);
	};

	return (
		<>
			<Stack.Toolbar placement="left">
				<Stack.Toolbar.Button variant="plain" icon="xmark" onPress={closeModal} />
			</Stack.Toolbar>

			<Stack.Screen options={{ title: initDraft.title || draft.title }} />

			<Stack.Toolbar placement="right">
				<Stack.Toolbar.Button variant="done" icon="checkmark" onPress={save} tintColor={settingAccent} />
			</Stack.Toolbar>
		</>
	);
};

export default Header;
