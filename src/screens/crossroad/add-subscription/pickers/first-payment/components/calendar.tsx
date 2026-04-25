import React, { useMemo } from 'react';
import { useLocales } from 'expo-localization';
import { format, parseISO, addYears, endOfYear } from 'date-fns';

import { useSettingsValue } from '@hooks';
import { useShallow } from 'zustand/react/shallow';
import { useDraftStore } from '@screens/crossroad/add-subscription/hooks';

import { Host, DatePicker } from '@expo/ui/swift-ui';
import { datePickerStyle } from '@expo/ui/swift-ui/modifiers';

import { MIN_EVENT_DATE } from '@screens/crossroad/add-subscription/events';

import type { UserT } from '@models';
import type { DatePickerComponent } from '@expo/ui/swift-ui';

const DISPLAYED_COMPONENTS: DatePickerComponent[] = ['date'];
const PICKER_MODIFIERS = [datePickerStyle('graphical')];

const Calendar = () => {
	const [locale] = useLocales();
	const maxHorizon = useSettingsValue<UserT['max_horizon']>('max_horizon');

	const { firstPaymentDate, setFirstPaymentDate } = useDraftStore(
		useShallow((state) => ({
			firstPaymentDate: state.first_payment_date,
			setFirstPaymentDate: state.actions.setFirstPaymentDate
		}))
	);

	const maxEventDate = useMemo(() => {
		return endOfYear(addYears(new Date(), maxHorizon));
	}, [maxHorizon]);

	const onDateChangeHd = (date: Date) => {
		setFirstPaymentDate(format(date, 'yyyy-MM-dd'));
	};

	return (
		<Host matchContents>
			<DatePicker
				selection={parseISO(firstPaymentDate)}
				displayedComponents={DISPLAYED_COMPONENTS}
				onDateChange={onDateChangeHd}
				range={{ start: MIN_EVENT_DATE, end: maxEventDate }}
				modifiers={PICKER_MODIFIERS}
				locale={locale?.languageTag ?? 'en-US'}
			/>
		</Host>
	);
};

export default Calendar;
