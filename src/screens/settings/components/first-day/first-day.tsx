import React from 'react';
import * as Haptics from 'expo-haptics';

import { useTranslation } from 'react-i18next';
import { useSettingsValue, setSettingsValue } from '@hooks';

import Root, { Inner, Label, Code, DayHint } from './first-day.styles';

import type { UserT } from '@models';

const NEXT_DAYS_MAP = {
	monday: 'sunday',
	sunday: 'monday'
} as const;

const FirstDay = () => {
	const { t } = useTranslation();
	const firstDay = useSettingsValue<UserT['first_day']>('first_day');

	const setDay = () => {
		setSettingsValue<UserT['first_day']>('first_day', NEXT_DAYS_MAP[firstDay]);

		Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
	};

	return (
		<Root onPress={setDay}>
			<Inner isInteractive>
				<Label>{t('settings.preferences.first_day')}</Label>
				<Code>{t(`settings.preferences.days.${firstDay}`)}</Code>

				<DayHint>
					{firstDay === 'sunday' ? t('settings.preferences.day_hint_us') : t('settings.preferences.day_hint_iso')}
				</DayHint>
			</Inner>
		</Root>
	);
};

export default FirstDay;
