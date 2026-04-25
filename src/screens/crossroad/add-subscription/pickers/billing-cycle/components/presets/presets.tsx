import React from 'react';
import { useShallow } from 'zustand/react/shallow';

import { useAccent, useGlassStyle } from '@hooks';
import { useDraftStore } from '@screens/crossroad/add-subscription/hooks';

import Root, { Chip, InnerChip, Label } from './presets.styles';

import type { BillingCycleT } from '@screens/crossroad/add-subscription/hooks/use-draft-store';

type PresetT = {
	type: BillingCycleT;
	value: number;
};

const PRESETS: (PresetT & { label: string })[] = [
	{ label: 'Weekly', type: 'weeks', value: 1 },
	{ label: 'Monthly', type: 'months', value: 1 },
	{ label: 'Quarterly', type: 'months', value: 3 },
	{ label: 'Semiannually', type: 'months', value: 6 },
	{ label: 'Yearly', type: 'years', value: 1 }
];

const Presets = () => {
	const settingAccent = useAccent();
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
			{PRESETS.map((preset) => {
				const isActive = preset.type === type && preset.value === value;
				const onPressHd = () => setBillingCycle(preset.type, preset.value);

				return (
					<Chip key={preset.label} glassEffectStyle={glassEffectStyle}>
						<InnerChip $isActive={isActive} $tintColor={settingAccent} onPress={onPressHd}>
							<Label $isActive={isActive} $tintColor={settingAccent}>
								{preset.label}
							</Label>
						</InnerChip>
					</Chip>
				);
			})}
		</Root>
	);
};

export default Presets;
