import React, { useEffect, useMemo, useState } from 'react';
import { clamp } from 'ramda';

import { useDraftStore } from '@screens/crossroad/add-subscription/hooks';

import { tag, font, pickerStyle } from '@expo/ui/swift-ui/modifiers';
import { Section, Picker, Text, HStack, Spacer } from '@expo/ui/swift-ui';

const CYCLE_OPTIONS = ['days', 'weeks'] as const;
type Cycle = (typeof CYCLE_OPTIONS)[number];

const PERIOD_LIMITS: Record<Cycle, { min: number; max: number }> = {
	days: { min: 1, max: 14 },
	weeks: { min: 1, max: 6 }
};

const getCycleFromDays = (days: number): Cycle => {
	return days <= PERIOD_LIMITS.days.max ? 'days' : 'weeks';
};

const getPeriodFromDays = (days: number, cycle: Cycle): number => {
	const value = cycle === 'weeks' ? Math.ceil(days / 7) : days;
	const { min, max } = PERIOD_LIMITS[cycle];

	return clamp(min, max, value);
};

const convertDaysToCycle = (days: number) => {
	const cycle = getCycleFromDays(days);
	const period = getPeriodFromDays(days, cycle);

	return { period, cycle };
};

const getDaysFromSelection = (period: number, cycle: Cycle): number => {
	return cycle === 'weeks' ? period * 7 : period;
};

const getPeriodOptions = (cycle: Cycle): number[] => {
	const { min, max } = PERIOD_LIMITS[cycle];

	return Array.from({ length: max - min + 1 }, (_, index) => min + index);
};

const DurationPicker = () => {
	const isEnabled = useDraftStore((state) => state.notify_enabled);
	const daysBefore = useDraftStore((state) => state.notify_days_before);
	const setDaysBefore = useDraftStore((state) => state.actions.setNotifyDaysBefore);

	const initialSelection = useMemo(() => {
		return convertDaysToCycle(daysBefore);
	}, [daysBefore]);

	const [selectedPeriod, setSelectedPeriod] = useState(initialSelection.period);
	const [selectedCycle, setSelectedCycle] = useState<Cycle>(initialSelection.cycle);

	const periodOptions = useMemo(() => {
		return getPeriodOptions(selectedCycle);
	}, [selectedCycle]);

	useEffect(() => {
		const { min, max } = PERIOD_LIMITS[selectedCycle];

		setSelectedPeriod((period) => clamp(min, max, period));
	}, [selectedCycle]);

	useEffect(() => {
		const days = getDaysFromSelection(selectedPeriod, selectedCycle);

		if (days !== daysBefore) {
			setDaysBefore(days);
		}
	}, [selectedPeriod, selectedCycle, daysBefore, setDaysBefore]);

	if (!isEnabled) {
		return null;
	}

	return (
		<Section
			title="When"
			footer={
				<Text modifiers={[font({ size: 14, design: 'rounded' })]}>
					You will get notification {selectedPeriod} {selectedCycle} prior to the next payment
				</Text>
			}
		>
			<HStack>
				<Picker modifiers={[pickerStyle('wheel')]} selection={selectedPeriod} onSelectionChange={setSelectedPeriod}>
					{periodOptions.map((option) => (
						<Text key={option} modifiers={[tag(option)]}>
							{option}
						</Text>
					))}
				</Picker>

				<Spacer />

				<Picker modifiers={[pickerStyle('wheel')]} selection={selectedCycle} onSelectionChange={setSelectedCycle}>
					{CYCLE_OPTIONS.map((option) => (
						<Text key={option} modifiers={[tag(option)]}>
							{option}
						</Text>
					))}
				</Picker>
			</HStack>
		</Section>
	);
};

export default DurationPicker;
