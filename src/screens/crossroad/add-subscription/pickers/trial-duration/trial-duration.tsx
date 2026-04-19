import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Pressable } from 'react-native';
import { format, parseISO } from 'date-fns';
import { useTheme } from 'styled-components/native';
import { useShallow } from 'zustand/react/shallow';
import { SymbolView } from 'expo-symbols';
import { useLocalSearchParams } from 'expo-router';

import { useAccent } from '@hooks';
import { useDraftStore } from '@screens/crossroad/add-subscription/hooks';
import {
	addByCycle,
	type BillingCycleT
} from '@screens/crossroad/add-subscription/hooks/use-draft-store';

import { TextField, type TextFieldRef } from '@ui';
import { keyboardType } from '@expo/ui/swift-ui/modifiers';
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
	ValueInputWrap,
	ValueUnit,
	UnitRow,
	UnitChipWrap,
	UnitChip,
	UnitLabel,
	SyncCard,
	SyncPressable,
	SyncText,
	SyncTitle,
	SyncDescription,
	FromTimelineBanner,
	BannerTextBlock,
	BannerTitle,
	BannerDescription
} from './trial-duration.styles';

const PRESETS: { label: string; type: BillingCycleT; value: number }[] = [
	{ label: '3 days', type: 'days', value: 3 },
	{ label: '1 week', type: 'weeks', value: 1 },
	{ label: '2 weeks', type: 'weeks', value: 2 },
	{ label: '30 days', type: 'days', value: 30 },
	{ label: '1 month', type: 'months', value: 1 },
	{ label: '60 days', type: 'days', value: 60 },
	{ label: '3 months', type: 'months', value: 3 }
];

const UNITS: BillingCycleT[] = ['days', 'weeks', 'months', 'years'];

const MIN_VALUE = 1;
const MAX_VALUE = 365;

const clampValue = (n: number) => Math.max(MIN_VALUE, Math.min(MAX_VALUE, n));

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

const TrialDurationScreen = () => {
	const theme = useTheme();
	const accent = useAccent();
	const { from } = useLocalSearchParams<{ from?: string }>();
	const fromTimeline = from === 'timeline';

	const glassEffectStyle = !theme.is_oled && theme.tint === 'dark' ? 'regular' : 'clear';

	const { type, value, timeline, firstPaymentDate, setTrialDuration, syncFirstPaymentToTrial } =
		useDraftStore(
			useShallow((state) => ({
				type: state.trial_duration_type,
				value: state.trial_duration_value,
				timeline: state.timeline,
				firstPaymentDate: state.first_payment_date,
				setTrialDuration: state.actions.setTrialDuration,
				syncFirstPaymentToTrial: state.actions.syncFirstPaymentToTrial
			}))
		);

	const trial = timeline.find((e) => e.type === 'trial');
	const expectedFirstPayment = useMemo(() => {
		if (!trial || trial.type !== 'trial') return null;
		return format(addByCycle(parseISO(trial.date), trial.duration_type, trial.duration_value), 'yyyy-MM-dd');
	}, [trial]);

	const needsSync = expectedFirstPayment != null && expectedFirstPayment !== firstPaymentDate;

	const textRef = useRef<TextFieldRef>(null);
	const [text, setText] = useState(() => String(value));

	// Keep the native field in sync when value changes externally (stepper, presets, unit convert).
	useEffect(() => {
		const expected = String(value);
		if (expected !== text) {
			setText(expected);
			textRef.current?.setText(expected);
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [value]);

	const commitValue = (next: number) => {
		const clamped = clampValue(next);
		if (clamped !== value) setTrialDuration(type, clamped);
	};

	const handleValueChange = (next: number) => {
		commitValue(next);
	};

	const handleTextChange = (next: string) => {
		// Strip anything that's not a digit — iOS number-pad usually sends just digits but guard anyway.
		const digits = next.replace(/\D/g, '');
		setText(digits);

		const parsed = parseInt(digits, 10);
		if (Number.isFinite(parsed) && parsed >= MIN_VALUE && parsed <= MAX_VALUE) {
			if (parsed !== value) setTrialDuration(type, parsed);
		}
	};

	const handleFocusChange = (focused: boolean) => {
		if (focused) return;

		// Blur: normalize the buffer to a valid value.
		const parsed = parseInt(text, 10);
		const clamped = Number.isFinite(parsed) ? clampValue(parsed) : value;
		const expected = String(clamped);

		if (clamped !== value) setTrialDuration(type, clamped);
		if (expected !== text) {
			setText(expected);
			textRef.current?.setText(expected);
		}
	};

	const dismissKeyboard = () => {
		textRef.current?.blur();
	};

	const handleTypeChange = (next: BillingCycleT) => () => {
		setTrialDuration(next, value);
	};

	const handlePreset = (preset: { type: BillingCycleT; value: number }) => () => {
		setTrialDuration(preset.type, preset.value);
	};

	const isPresetActive = (preset: { type: BillingCycleT; value: number }) =>
		preset.type === type && preset.value === value;

	return (
		<>
			<Root>
				<Pressable onPress={dismissKeyboard}>
					{fromTimeline && (
						<FromTimelineBanner $accent={accent}>
							<SymbolView
								name="point.3.connected.trianglepath.dotted"
								size={18}
								tintColor={accent}
								weight="semibold"
							/>
							<BannerTextBlock>
								<BannerTitle $accent={accent}>Editing trial event</BannerTitle>
								<BannerDescription>
									Duration changes apply directly to the trial on the timeline.
								</BannerDescription>
							</BannerTextBlock>
						</FromTimelineBanner>
					)}

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
								$disabled={value <= MIN_VALUE}
								disabled={value <= MIN_VALUE}
							>
								<SymbolView name="minus" size={20} tintColor={theme.text.primary} />
							</StepperPressable>
						</StepperButton>

						<ValueDisplay onStartShouldSetResponder={() => true}>
							<ValueInputWrap>
								<TextField
									ref={textRef}
									defaultValue={String(value)}
									onValueChange={handleTextChange}
									onFocusChange={handleFocusChange}
									fontSize={52}
									fontWeight="bold"
									align="center"
									matchContents={{ vertical: true }}
									style={{ flex: 1 }}
									modifiers={[keyboardType('numeric')]}
								/>
							</ValueInputWrap>
							<ValueUnit>{unitLabel(type, value)}</ValueUnit>
						</ValueDisplay>

						<StepperButton glassEffectStyle={glassEffectStyle}>
							<StepperPressable
								onPress={() => handleValueChange(value + 1)}
								$disabled={value >= MAX_VALUE}
								disabled={value >= MAX_VALUE}
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

					{needsSync && expectedFirstPayment && (
						<SyncCard glassEffectStyle={glassEffectStyle}>
							<SyncPressable $accent={accent} onPress={syncFirstPaymentToTrial}>
								<SymbolView name="arrow.triangle.2.circlepath" size={18} tintColor={accent} weight="semibold" />
								<SyncText>
									<SyncTitle $accent={accent}>Sync First Payment Date</SyncTitle>
									<SyncDescription>
										Move it to {format(parseISO(expectedFirstPayment), 'MMM d, yyyy')} — right after the trial ends.
									</SyncDescription>
								</SyncText>
								<SymbolView name="chevron.right" size={14} tintColor={accent} weight="semibold" />
							</SyncPressable>
						</SyncCard>
					)}
				</Pressable>
			</Root>
		</>
	);
};

export default TrialDurationScreen;
