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
	{ label: '3 days', type: 'days', value: 3 },
	{ label: '1 week', type: 'weeks', value: 1 },
	{ label: '2 weeks', type: 'weeks', value: 2 },
	{ label: '30 days', type: 'days', value: 30 },
	{ label: '1 month', type: 'months', value: 1 },
	{ label: '60 days', type: 'days', value: 60 },
	{ label: '3 months', type: 'months', value: 3 }
];

const Presets = () => {
	const settingAccent = useAccent();
	const glassEffectStyle = useGlassStyle();

	const { type, value, setTrialDuration } = useDraftStore(
		useShallow((state) => ({
			type: state.trial_duration_type,
			value: state.trial_duration_value,
			setTrialDuration: state.actions.setTrialDuration
		}))
	);

	const handlePreset = (preset: PresetT) => () => {
		setTrialDuration(preset.type, preset.value);
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
