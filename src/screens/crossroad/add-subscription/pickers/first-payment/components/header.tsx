import React from 'react';
import { format, isSameDay } from 'date-fns';
import { Stack, useRouter } from 'expo-router';
import { useShallow } from 'zustand/react/shallow';

import { useAccent } from '@hooks';
import { useDraftStore } from '@screens/crossroad/add-subscription/hooks';

const useData = () => {
	const { firstPaymentDate, setFirstPaymentDate } = useDraftStore(
		useShallow((state) => ({
			firstPaymentDate: state.first_payment_date,
			setFirstPaymentDate: state.actions.setFirstPaymentDate
		}))
	);

	return {
		firstPaymentDate,
		setFirstPaymentDate,
		isToday: isSameDay(new Date(), firstPaymentDate)
	};
};

const Header = () => {
	const router = useRouter();
	const settingAccent = useAccent();
	const { setFirstPaymentDate, isToday } = useData();

	const setToday = () => {
		setFirstPaymentDate(format(new Date(), 'yyyy-MM-dd'));
	};

	const confirm = () => {
		router.back();
	};

	return (
		<>
			<Stack.Toolbar placement="left">
				<Stack.Toolbar.Button variant="plain" disabled={isToday} onPress={setToday} tintColor={settingAccent}>
					Today
				</Stack.Toolbar.Button>
			</Stack.Toolbar>

			<Stack.Toolbar placement="right">
				<Stack.Toolbar.Button variant="done" icon="checkmark" onPress={confirm} tintColor={settingAccent} />
			</Stack.Toolbar>
		</>
	);
};

export default Header;
