import React from 'react';
import { useSettingsValue } from '@hooks';
// import { startOfToday, startOfMonth } from 'date-fns';
import { NativeTabs } from 'expo-router/unstable-native-tabs';

import type { AccentT } from '@themes';

const TabLayout = () => {
	const settingAccent = useSettingsValue<AccentT>('accent');

	// const { txViewMode } = useSearchParams();
	// const { view_mode, tx_dates } = useAppModel();

	// const onTransactionsPress = () => {
	// 	if (txViewMode === 'list') {
	// 		view_mode.list.scrollToTop();
	// 	}

	// 	if (txViewMode === 'calendar') {
	// 		const today = startOfToday();
	// 		tx_dates.selected.set(today);
	// 		tx_dates.activeMonth.set(startOfMonth(today));
	// 	}
	// };

	return (
		<NativeTabs key={settingAccent}>
			<NativeTabs.Trigger name="transactions">
				<NativeTabs.Trigger.Label>History</NativeTabs.Trigger.Label>
				<NativeTabs.Trigger.Icon selectedColor={settingAccent} sf="cabinet" />
			</NativeTabs.Trigger>

			<NativeTabs.Trigger name="library">
				<NativeTabs.Trigger.Label>Library</NativeTabs.Trigger.Label>
				<NativeTabs.Trigger.Icon selectedColor={settingAccent} sf="books.vertical" />
			</NativeTabs.Trigger>

			<NativeTabs.Trigger name="settings">
				<NativeTabs.Trigger.Label>Settings</NativeTabs.Trigger.Label>
				<NativeTabs.Trigger.Icon selectedColor={settingAccent} sf="gear" />
			</NativeTabs.Trigger>

			<NativeTabs.Trigger name="add" role="search">
				<NativeTabs.Trigger.Label>New</NativeTabs.Trigger.Label>
				<NativeTabs.Trigger.Icon selectedColor={settingAccent} sf="plus" />
			</NativeTabs.Trigger>

			<NativeTabs.Screen name="add" options={{ headerShown: false }} />
		</NativeTabs>
	);
};

export default TabLayout;
