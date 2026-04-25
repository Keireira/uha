import React from 'react';
import { useShallow } from 'zustand/react/shallow';

import { useAccent, useGlassStyle } from '@hooks';
import { useDraftStore } from '@screens/crossroad/add-subscription/hooks';

import Root, { Chip, InnerChip, Label } from './units.styles';

import type { BillingCycleT } from '@screens/crossroad/add-subscription/hooks/use-draft-store';

const UNITS: BillingCycleT[] = ['days', 'weeks', 'months', 'years'];

const Units = () => {
	const accent = useAccent();
	const glassEffectStyle = useGlassStyle();
	const { type, value, setBillingCycle } = useDraftStore(
		useShallow((state) => ({
			type: state.billing_cycle_type,
			value: state.billing_cycle_value,
			setBillingCycle: state.actions.setBillingCycle
		}))
	);

	return (
		<Root>
			{UNITS.map((unit) => {
				const isActive = unit === type;
				const onPressHd = () => setBillingCycle(unit, value);

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
