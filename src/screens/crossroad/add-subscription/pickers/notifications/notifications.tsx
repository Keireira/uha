import React from 'react';
import { Switch } from 'react-native';
import { SymbolView } from 'expo-symbols';
import { useShallow } from 'zustand/react/shallow';

import { useAccent } from '@hooks';
import { useDraftStore } from '@screens/crossroad/add-subscription/hooks';

import Root, {
	Section,
	SectionHeader,
	SectionTitle,
	SectionHint,
	Card,
	ToggleRow,
	ToggleLabel,
	DaysList,
	DayRow,
	DayLabel,
	DayCheck
} from './notifications.styles';

type PresetT = { label: string; value: number };

const DAY_PRESETS: PresetT[] = [
	{ label: 'On the day', value: 0 },
	{ label: '1 day before', value: 1 },
	{ label: '2 days before', value: 2 },
	{ label: '3 days before', value: 3 },
	{ label: '1 week before', value: 7 },
	{ label: '2 weeks before', value: 14 }
];

const NotificationsScreen = () => {
	const accent = useAccent();

	const { enabled, daysBefore, setEnabled, setDaysBefore } = useDraftStore(
		useShallow((state) => ({
			enabled: state.notify_enabled,
			daysBefore: state.notify_days_before,
			setEnabled: state.actions.setNotifyEnabled,
			setDaysBefore: state.actions.setNotifyDaysBefore
		}))
	);

	const toggleDay = (value: number) => () => {
		const exists = daysBefore.includes(value);
		const next = exists ? daysBefore.filter((d) => d !== value) : [...daysBefore, value].sort((a, b) => a - b);
		setDaysBefore(next);
	};

	return (
		<Root>
			<Section>
				<SectionHeader>
					<SectionTitle>Reminders</SectionTitle>
				</SectionHeader>
				<Card>
					<ToggleRow>
						<ToggleLabel>Notify me before payment</ToggleLabel>
						<Switch value={enabled} onValueChange={setEnabled} />
					</ToggleRow>
				</Card>
				<SectionHint>Get a push notification ahead of each upcoming payment.</SectionHint>
			</Section>

			{enabled && (
				<Section>
					<SectionHeader>
						<SectionTitle>When</SectionTitle>
					</SectionHeader>
					<Card>
						<DaysList>
							{DAY_PRESETS.map((preset, i) => {
								const active = daysBefore.includes(preset.value);
								const isLast = i === DAY_PRESETS.length - 1;

								return (
									<DayRow key={preset.value} $isLast={isLast} onPress={toggleDay(preset.value)}>
										<DayLabel>{preset.label}</DayLabel>
										<DayCheck $active={active} $accent={accent}>
											{active && <SymbolView name="checkmark" size={14} tintColor="#fff" />}
										</DayCheck>
									</DayRow>
								);
							})}
						</DaysList>
					</Card>
					<SectionHint>Pick any combination — you'll get one notification at each chosen moment.</SectionHint>
				</Section>
			)}
		</Root>
	);
};

export default NotificationsScreen;
