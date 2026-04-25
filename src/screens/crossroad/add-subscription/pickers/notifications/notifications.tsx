import React from 'react';
import { useShallow } from 'zustand/react/shallow';
import { useDraftStore } from '@screens/crossroad/add-subscription/hooks';

import { Header } from './components';
import Root from './notifications.styles';
import { Host, List, Section, Toggle, Text } from '@expo/ui/swift-ui';
import { environment, listStyle, tag } from '@expo/ui/swift-ui/modifiers';

const DAY_PRESETS = [0, 1, 2, 3, 7, 14] as const;
const TMP_LABELS = {
	0: 'On the day',
	1: '1 day before',
	2: '2 days before',
	3: '3 days before',
	7: '1 week before',
	14: '2 weeks before'
} as const;

const NotificationsScreen = () => {
	const { isEnabled, daysBefore, setEnabled, setDaysBefore } = useDraftStore(
		useShallow((state) => ({
			isEnabled: state.notify_enabled,
			daysBefore: state.notify_days_before,
			setEnabled: state.actions.setNotifyEnabled,
			setDaysBefore: state.actions.setNotifyDaysBefore
		}))
	);

	const onSelectionChangeHd = (selection: (string | number)[]) => {
		const nextPeriods = selection.map((value) => Number.parseInt(`${value}`, 10));

		setDaysBefore(nextPeriods);
	};

	return (
		<Root>
			<Header />

			<Host style={{ flex: 1 }} useViewportSizeMeasurement>
				<List
					selection={daysBefore}
					onSelectionChange={onSelectionChangeHd}
					modifiers={[listStyle('insetGrouped'), environment('editMode', 'active')]}
				>
					<Section title="Reminders" footer={<Text>Get a push notification ahead of each upcoming payment.</Text>}>
						<Toggle label="Notify me before payment" isOn={isEnabled} onIsOnChange={setEnabled} />
					</Section>

					{isEnabled && (
						<Section
							title="When"
							footer={<Text>Pick any combination — you will get one notification at each chosen moment.</Text>}
						>
							{DAY_PRESETS.map((days) => {
								const label = TMP_LABELS[days];

								return (
									<Text key={days} modifiers={[tag(days)]}>
										{label}
									</Text>
								);
							})}
						</Section>
					)}
				</List>
			</Host>
		</Root>
	);
};

export default NotificationsScreen;
