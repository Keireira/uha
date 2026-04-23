import React from 'react';
import { useLocales } from 'expo-localization';
import { useShallow } from 'zustand/react/shallow';
import { format, parseISO, addYears, endOfYear } from 'date-fns';

import { useSettingsValue } from '@hooks';
import { useDraftStore } from '@screens/crossroad/add-subscription/hooks';

import { Host, DatePicker } from '@expo/ui/swift-ui';
import { datePickerStyle } from '@expo/ui/swift-ui/modifiers';

import { MIN_EVENT_DATE } from '@screens/crossroad/add-subscription/events';
import type { UserT } from '@models';

const useData = () => {
	const maxHorizon = useSettingsValue<UserT['max_horizon']>('max_horizon');

	const { firstPaymentDate, setFirstPaymentDate } = useDraftStore(
		useShallow((state) => ({
			firstPaymentDate: state.first_payment_date,
			setFirstPaymentDate: state.actions.setFirstPaymentDate
		}))
	);

	return {
		firstPaymentDate,
		setFirstPaymentDate,
		maxEventDate: endOfYear(addYears(new Date(), maxHorizon))
	};
};

const Calendar = () => {
	const [locale] = useLocales();
	const { firstPaymentDate, setFirstPaymentDate, maxEventDate } = useData();

	const handleDateChange = (date: Date) => {
		setFirstPaymentDate(format(date, 'yyyy-MM-dd'));
	};

	return (
		<Host matchContents>
			<DatePicker
				selection={parseISO(firstPaymentDate)}
				displayedComponents={['date']}
				onDateChange={handleDateChange}
				range={{
					start: MIN_EVENT_DATE,
					end: maxEventDate
				}}
				modifiers={[datePickerStyle('graphical')]}
				locale={locale.languageTag || 'en_US'}
			/>
		</Host>
	);
};

export default Calendar;
