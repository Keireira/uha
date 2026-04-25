import React from 'react';

import { useAccent, useGlassStyle } from '@hooks';
import { useShallow } from 'zustand/react/shallow';
import { useDraftStore } from '@screens/crossroad/add-subscription/hooks';

import Root, { Chip, InnerChip, Label } from './units.styles';

import type { BillingCycleT } from '@screens/crossroad/add-subscription/hooks/use-draft-store';

const UNITS: BillingCycleT[] = ['days', 'weeks', 'months', 'years'];

const Units = () => {
	const accent = useAccent();
	const glassEffectStyle = useGlassStyle();

	const { type, value, setTrialDuration } = useDraftStore(
		useShallow((state) => ({
			type: state.trial_duration_type,
			value: state.trial_duration_value,
			setTrialDuration: state.actions.setTrialDuration
		}))
	);

	return (
		<Root>
			{UNITS.map((unit) => {
				const isActive = unit === type;
				const onPressHd = () => setTrialDuration(unit, value);

				return (
					<Chip key={unit} glassEffectStyle={glassEffectStyle}>
						<InnerChip $isActive={isActive} $tintColor={accent} onPress={onPressHd}>
							<Label $isActive={isActive} $tintColor={accent}>
								{unit}
							</Label>
						</InnerChip>
					</Chip>
				);
			})}
		</Root>
	);
};

export default Units;
