import React from 'react';
import { useRouter } from 'expo-router';
import { useTheme } from 'styled-components/native';
import { useShallow } from 'zustand/react/shallow';
import { SymbolView } from 'expo-symbols';

import { useAccent } from '@hooks';
import { useDraftStore } from '@screens/crossroad/add-subscription/hooks';
import type { BillingCycleT } from '@screens/crossroad/add-subscription/hooks/use-draft-store';

import Root, {
	Header,
	Title,
	Presets,
	PresetChip,
	PresetPressable,
	PresetLabel,
	ValueBlock,
	StepperButton,
	StepperPressable,
	ValueDisplay,
	ValueNumber,
	ValueUnit,
	UnitRow,
	UnitChipWrap,
	UnitChip,
	UnitLabel
} from './billing-cycle.styles';

const PRESETS: { label: string; type: BillingCycleT; value: number }[] = [
	{ label: 'Weekly', type: 'weeks', value: 1 },
	{ label: 'Monthly', type: 'months', value: 1 },
	{ label: 'Quarterly', type: 'months', value: 3 },
	{ label: 'Semiannually', type: 'months', value: 6 },
	{ label: 'Yearly', type: 'years', value: 1 }
];

const UNITS: BillingCycleT[] = ['days', 'weeks', 'months', 'years'];

const unitLabel = (type: BillingCycleT, value: number) => {
	switch (type) {
		case 'days':
			return value === 1 ? 'day' : 'days';
		case 'weeks':
			return value === 1 ? 'week' : 'weeks';
		case 'months':
			return value === 1 ? 'month' : 'months';
		case 'years':
			return value === 1 ? 'year' : 'years';
	}
};

const BillingCycleScreen = () => {
	const router = useRouter();
	const theme = useTheme();
	const accent = useAccent();

	const glassEffectStyle = !theme.is_oled && theme.tint === 'dark' ? 'regular' : 'clear';

	const { type, value, setBillingCycle } = useDraftStore(
		useShallow((state) => ({
			type: state.billing_cycle_type,
			value: state.billing_cycle_value,
			setBillingCycle: state.actions.setBillingCycle
		}))
	);

	const handleValueChange = (next: number) => {
		setBillingCycle(type, Math.max(1, Math.min(365, next)));
	};

	const handleTypeChange = (next: BillingCycleT) => () => {
		setBillingCycle(next, value);
	};

	const handlePreset = (preset: { type: BillingCycleT; value: number }) => () => {
		setBillingCycle(preset.type, preset.value);
		router.back();
	};

	const isPresetActive = (preset: { type: BillingCycleT; value: number }) =>
		preset.type === type && preset.value === value;

	return (
		<Root>
			<Header>
				<Title>Presets</Title>
			</Header>

			<Presets>
				{PRESETS.map((preset) => {
					const active = isPresetActive(preset);
					return (
						<PresetChip key={preset.label} glassEffectStyle={glassEffectStyle}>
							<PresetPressable $active={active} $accent={accent} onPress={handlePreset(preset)}>
								<PresetLabel $active={active} $accent={accent}>
									{preset.label}
								</PresetLabel>
							</PresetPressable>
						</PresetChip>
					);
				})}
			</Presets>

			<Header>
				<Title>Custom</Title>
			</Header>

			<ValueBlock>
				<StepperButton glassEffectStyle={glassEffectStyle}>
					<StepperPressable
						onPress={() => handleValueChange(value - 1)}
						$disabled={value <= 1}
						disabled={value <= 1}
					>
						<SymbolView name="minus" size={20} tintColor={theme.text.primary} />
					</StepperPressable>
				</StepperButton>

				<ValueDisplay>
					<ValueNumber>{value}</ValueNumber>
					<ValueUnit>{unitLabel(type, value)}</ValueUnit>
				</ValueDisplay>

				<StepperButton glassEffectStyle={glassEffectStyle}>
					<StepperPressable
						onPress={() => handleValueChange(value + 1)}
						$disabled={value >= 365}
						disabled={value >= 365}
					>
						<SymbolView name="plus" size={20} tintColor={theme.text.primary} />
					</StepperPressable>
				</StepperButton>
			</ValueBlock>

			<UnitRow>
				{UNITS.map((unit) => {
					const active = unit === type;
					return (
						<UnitChipWrap key={unit} glassEffectStyle={glassEffectStyle}>
							<UnitChip $active={active} $accent={accent} onPress={handleTypeChange(unit)}>
								<UnitLabel $active={active} $accent={accent}>
									{unit}
								</UnitLabel>
							</UnitChip>
						</UnitChipWrap>
					);
				})}
			</UnitRow>
		</Root>
	);
};

export default BillingCycleScreen;
