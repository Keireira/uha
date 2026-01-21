import React from 'react';
import { startOfToday, startOfMonth } from 'date-fns';

import { useAppModel } from '@models';
import { useSearchParams } from '@hooks';

import { Navbar } from '@elements';
import { Tabs, TabSlot, TabList, TabTrigger } from 'expo-router/ui';

const TabLayout = () => {
	const { txViewMode } = useSearchParams();
	const { view_mode, tx_dates } = useAppModel();

	const onTransactionsPress = () => {
		if (txViewMode === 'list') {
			view_mode.list.scrollToTop();
		}

		if (txViewMode === 'calendar') {
			const today = startOfToday();
			tx_dates.selected.set(today);
			tx_dates.activeMonth.set(startOfMonth(today));
		}
	};

	return (
		<Tabs>
			<TabSlot />

			<TabList asChild>
				<Navbar>
					<TabTrigger name="transactions" href="/(tabs)/transactions" asChild>
						{/* @TODO: Remove singleton later */}
						<Navbar.Button onActivePress={onTransactionsPress} onLongPress={onTransactionsPress}>
							<Navbar.Icon name={txViewMode === 'list' ? 'list' : 'calendar'} />
						</Navbar.Button>
					</TabTrigger>

					<TabTrigger name="library" href="/library" asChild>
						<Navbar.Button>
							<Navbar.Icon name="library" />
						</Navbar.Button>
					</TabTrigger>

					<TabTrigger name="settings" href="/settings" asChild>
						<Navbar.Button>
							<Navbar.Icon name="settings" />
						</Navbar.Button>
					</TabTrigger>
				</Navbar>
			</TabList>
		</Tabs>
	);
};

export default TabLayout;
