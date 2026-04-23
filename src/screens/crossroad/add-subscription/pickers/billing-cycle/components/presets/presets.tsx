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

	const handlePreset = (preset: PresetT) => () => {
		setBillingCycle(preset.type, preset.value);
	};

	const isPresetActive = (preset: PresetT) => {
		return preset.type === type && preset.value === value;
	};

	return (
		<Root>
			{PRESETS.map((preset) => {
				const isActive = isPresetActive(preset);

				return (
					<Chip key={preset.label} glassEffectStyle={glassEffectStyle}>
						<InnerChip $active={isActive} $tintColor={settingAccent} onPress={handlePreset(preset)}>
							<Label $active={isActive} $tintColor={settingAccent}>
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
