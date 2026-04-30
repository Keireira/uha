import React, { useMemo } from 'react';
import { useLocales } from 'expo-localization';
import { format, parseISO, addYears, endOfYear } from 'date-fns';

import { useShallow } from 'zustand/react/shallow';
import { useSettingsValue, useAccent } from '@hooks';
import { useDraftStore } from '@screens/crossroad/add-subscription/hooks';
import { MIN_EVENT_DATE, formatISODate, selectFirstPaymentDate } from '@screens/crossroad/add-subscription/events';

import { Host, DatePicker } from '@expo/ui/swift-ui';
import { tint, datePickerStyle } from '@expo/ui/swift-ui/modifiers';

import type { UserT } from '@models';

const Calendar = () => {
	const [locale] = useLocales();
	const settingAccent = useAccent();
	const maxHorizon = useSettingsValue<UserT['max_horizon']>('max_horizon');

	const { firstPaymentDate, setFirstPaymentDate } = useDraftStore(
		useShallow((state) => ({
			firstPaymentDate: selectFirstPaymentDate(state.timeline) ?? formatISODate(new Date()),
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
				displayedComponents={['date']}
				onDateChange={onDateChangeHd}
				range={{ start: MIN_EVENT_DATE, end: maxEventDate }}
				modifiers={[datePickerStyle('graphical'), tint(settingAccent)]}
				locale={locale?.languageTag ?? 'en-US'}
			/>
		</Host>
	);
};

export default Calendar;
