import React from 'react';
import { useTranslation } from 'react-i18next';
import { useTheme } from 'styled-components/native';

import * as Haptics from 'expo-haptics';
import { setSettingsValue, useSettingsValue, useEntitlement, useFeatureGate } from '@hooks';

import { SymbolView } from 'expo-symbols';
import Root, { Label, Code, Stepper, StepperButton } from './max-horizon.styles';

import type { UserT } from '@models';

const MaxHorizon = () => {
	const theme = useTheme();
	const { t } = useTranslation();

	const { tier } = useEntitlement();
	const openFeatureGate = useFeatureGate();
	const maxHorizon = useSettingsValue<UserT['max_horizon']>('max_horizon');

	const decreaseYear = () => {
		if (maxHorizon <= 2) return;

		setSettingsValue('max_horizon', maxHorizon - 1);
		Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
	};

	const addYear = () => {
		if (maxHorizon >= tier.maxHorizon) {
			openFeatureGate();
			return;
		}

		if (maxHorizon < 10) {
			setSettingsValue('max_horizon', maxHorizon + 1);
			Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
		}
	};

	return (
		<Root>
			<Label>{t('settings.preferences.max_horizon')}</Label>
			<Code>
				{maxHorizon}&nbsp;{t('settings.preferences.years_unit')}
			</Code>

			<Stepper>
				<StepperButton $disabled={maxHorizon <= 2} onPress={decreaseYear}>
					<SymbolView name="minus" size={13} weight="bold" tintColor={theme.text.secondary} />
				</StepperButton>

				<StepperButton $disabled={maxHorizon >= tier.maxHorizon} onPress={addYear}>
					<SymbolView name="plus" size={13} weight="bold" tintColor={theme.text.secondary} />
				</StepperButton>
			</Stepper>
		</Root>
	);
};

export default MaxHorizon;
