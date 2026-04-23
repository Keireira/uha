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

	const { type, value, setBillingCycle } = useDraftStore(
		useShallow((state) => ({
			type: state.billing_cycle_type,
			value: state.billing_cycle_value,
			setBillingCycle: state.actions.setBillingCycle
		}))
	);

	const handleTypeChange = (next: BillingCycleT) => () => {
		setBillingCycle(next, value);
	};

	return (
		<Root>
			{UNITS.map((unit) => {
				const isActive = unit === type;

				return (
					<Chip key={unit} glassEffectStyle={glassEffectStyle}>
						<InnerChip $active={isActive} $tintColor={accent} onPress={handleTypeChange(unit)}>
							<Label $active={isActive} $tintColor={accent}>
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
