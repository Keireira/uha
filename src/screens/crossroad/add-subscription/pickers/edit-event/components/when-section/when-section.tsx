import React, { useMemo } from 'react';
import { addYears, endOfYear } from 'date-fns';
import { useLocales } from 'expo-localization';
import { useAccent, useSettingsValue } from '@hooks';

import { DatePicker } from '@expo/ui/swift-ui';
import { datePickerStyle } from '@expo/ui/swift-ui/modifiers';

import { MIN_EVENT_DATE } from '@screens/crossroad/add-subscription/events';

import type { UserT } from '@models';
import type { Props } from './when-section.d';

const WhenSection = ({ date, setDate }: Props) => {
	const [locale] = useLocales();
	const settingAccent = useAccent();
	const maxHorizon = useSettingsValue<UserT['max_horizon']>('max_horizon');

	const maxEventDate = useMemo(() => {
		return endOfYear(addYears(new Date(), maxHorizon));
	}, [maxHorizon]);

	return (
		<DatePicker
			title="Date"
			selection={date}
			tint={settingAccent}
			onDateChange={setDate}
			displayedComponents={['date']}
			locale={locale?.languageTag ?? 'en-US'}
			modifiers={[datePickerStyle('compact')]}
			range={{
				start: MIN_EVENT_DATE,
				end: maxEventDate
			}}
		/>
	);
};

export default WhenSection;
