import React, { useMemo } from 'react';
import { addYears, endOfYear } from 'date-fns';
import { useLocales } from 'expo-localization';

import { useAccent, useSettingsValue } from '@hooks';

import { DatePicker } from '@expo/ui/swift-ui';
import { locale, firstWeekday } from '@modules/expo-ui-modifiers';
import { datePickerStyle, tint } from '@expo/ui/swift-ui/modifiers';

import { MIN_EVENT_DATE } from '@screens/crossroad/add-subscription/events';

import type { UserT } from '@models';
import type { Props } from './when-section.d';

const WhenSection = ({ date, setDate }: Props) => {
	const settingAccent = useAccent();
	const [activeLocale] = useLocales();
	const maxHorizon = useSettingsValue<UserT['max_horizon']>('max_horizon');
	const firstWeekdayValue = useSettingsValue<UserT['first_day']>('first_day');

	const maxEventDate = useMemo(() => {
		return endOfYear(addYears(new Date(), maxHorizon));
	}, [maxHorizon]);

	return (
		<DatePicker
			title="Date"
			selection={date}
			onDateChange={setDate}
			displayedComponents={['date']}
			modifiers={[
				tint(settingAccent),
				datePickerStyle('compact'),
				firstWeekday(firstWeekdayValue),
				locale(activeLocale?.languageTag ?? 'en-US')
			]}
			range={{
				start: MIN_EVENT_DATE,
				end: maxEventDate
			}}
		/>
	);
};

export default WhenSection;
