import React from 'react';
import { format, isSameDay } from 'date-fns';
import { Stack, useRouter } from 'expo-router';

import { useAccent } from '@hooks';
import { useShallow } from 'zustand/react/shallow';
import { useDraftStore } from '@screens/crossroad/add-subscription/hooks';
import { formatISODate, selectFirstPaymentDate } from '@screens/crossroad/add-subscription/events';

const Header = () => {
	const router = useRouter();
	const settingAccent = useAccent();

		const { firstPaymentDate, setFirstPaymentDate } = useDraftStore(
			useShallow((state) => ({
				firstPaymentDate: selectFirstPaymentDate(state.timeline) ?? formatISODate(new Date()),
				setFirstPaymentDate: state.actions.setFirstPaymentDate
			}))
		);

		const isToday = isSameDay(new Date(), firstPaymentDate);

	const onSetTodayHd = () => {
		setFirstPaymentDate(format(new Date(), 'yyyy-MM-dd'));
	};

	const onConfirmHd = () => {
		router.back();
	};

	return (
		<>
			<Stack.Toolbar placement="left">
				<Stack.Toolbar.Button variant="plain" disabled={isToday} onPress={onSetTodayHd} tintColor={settingAccent}>
					Today
				</Stack.Toolbar.Button>
			</Stack.Toolbar>

			<Stack.Toolbar placement="right">
				<Stack.Toolbar.Button variant="done" icon="checkmark" onPress={onConfirmHd} tintColor={settingAccent} />
			</Stack.Toolbar>
		</>
	);
};

export default Header;
