import React from 'react';
// import { startOfToday, startOfMonth } from 'date-fns';
import { NativeTabs } from 'expo-router/unstable-native-tabs';
// import { useAppModel } from '@models';
// import { useSearchParams } from '@hooks';

// import { Tabs, TabSlot, TabList, TabTrigger } from 'expo-router/ui';
// import { ListIcon, CalendarIcon, SettingsIcon, LibraryIcon, AddIcon } from '@ui/icons';

const TabLayout = () => {
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
		<NativeTabs>
			<NativeTabs.Trigger name="transactions">
				<NativeTabs.Trigger.Label>History</NativeTabs.Trigger.Label>
				<NativeTabs.Trigger.Icon sf="checklist.unchecked" />
			</NativeTabs.Trigger>

			<NativeTabs.Trigger name="library">
				<NativeTabs.Trigger.Label>Library</NativeTabs.Trigger.Label>
				<NativeTabs.Trigger.Icon sf="books.vertical" />
			</NativeTabs.Trigger>

			<NativeTabs.Trigger name="settings">
				<NativeTabs.Trigger.Label>Settings</NativeTabs.Trigger.Label>
				<NativeTabs.Trigger.Icon sf="gear" />
			</NativeTabs.Trigger>

			<NativeTabs.Trigger name="search" role="search">
				<NativeTabs.Trigger.Icon sf="plus" />
				<NativeTabs.Trigger.Label>Search</NativeTabs.Trigger.Label>
			</NativeTabs.Trigger>
		</NativeTabs>
	);
};

export default TabLayout;
