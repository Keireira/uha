import React, { useMemo } from 'react';
import { format } from 'date-fns';
import * as Haptics from 'expo-haptics';

import { useTranslation } from 'react-i18next';
import { useSettingsValue, setSettingsValue } from '@hooks';

import Root, { Inner, Label, Code, DayHint } from './first-day.styles';

import type { UserT } from '@models';

const NEXT_DAYS_MAP = {
	monday: 'sunday',
	sunday: 'monday'
} as const;

/** Reference dates: 2025-01-06 is Monday, 2025-01-05 is Sunday */
const REFERENCE_DATES = {
	monday: new Date(2025, 0, 6),
	sunday: new Date(2025, 0, 5)
} as const;

const FirstDay = () => {
	const { t } = useTranslation();
	const firstDay = useSettingsValue<UserT['first_day']>('first_day');

	const dayName = useMemo(() => format(REFERENCE_DATES[firstDay], 'EEEE'), [firstDay]);

	const setDay = () => {
		setSettingsValue<UserT['first_day']>('first_day', NEXT_DAYS_MAP[firstDay]);

		Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
	};

	return (
		<Root onPress={setDay}>
			<Inner isInteractive>
				<Label>{t('settings.preferences.first_day')}</Label>
				<Code numberOfLines={1} adjustsFontSizeToFit>
					{dayName}
				</Code>

				<DayHint>
					{firstDay === 'sunday' ? t('settings.preferences.day_hint_us') : t('settings.preferences.day_hint_iso')}
				</DayHint>
			</Inner>
		</Root>
	);
};

export default FirstDay;
