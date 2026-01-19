import React, { useState } from 'react';
import { useUnit } from 'effector-react';
import { startOfToday, startOfMonth } from 'date-fns';

import { useAppModel } from '@models';

import { Navbar, Crossroad } from '@elements';
import { Tabs, TabSlot, TabList, TabTrigger } from 'expo-router/ui';
// import { NativeTabs, Icon, Label } from 'expo-router/unstable-native-tabs';

const TabLayout = () => {
	const { view_mode, tx_dates } = useAppModel();
	const viewMode = useUnit(view_mode.$mode);

	const [isModalOpened, setIsModalOpened] = useState(false);

	const onTransactionsPress = () => {
		if (viewMode === 'list') {
			view_mode.list.scrollToTop();
		}

		if (viewMode === 'calendar') {
			const today = startOfToday();

			tx_dates.selected.set(today);
			tx_dates.activeMonth.set(startOfMonth(today));
		}
	};

	// const onTransactionsLongPress = () => {
	// 	if (viewMode === 'calendar') {
	// 		console.log('SHOW CONTEXT MENU WITH POSSIBLE VIEWS: list, calendar, subscriptions');
	// 	}
	// };

	return (
		<>
			<Tabs>
				<TabSlot />

				<TabList asChild>
					<Navbar>
						<TabTrigger name="home" href="/" asChild>
							{/* @TODO: Remove singleton later */}
							<Navbar.Button onPress={onTransactionsPress} onLongPress={onTransactionsPress}>
								<Navbar.Icon name={viewMode === 'list' ? 'list' : 'calendar'} />
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

						<Navbar.CircleButton onPress={() => setIsModalOpened(true)} />

						<TabTrigger name="add-category" href="/add-category" />
						<TabTrigger name="add-service" href="/add-service" />
						<TabTrigger name="add-payment" href="/add-payment" />
						<TabTrigger name="add-subscription" href="/add-subscription" />
					</Navbar>
				</TabList>
			</Tabs>

			<Crossroad isOpened={isModalOpened} onIsOpenedChange={setIsModalOpened} />
		</>
	);
};

export default TabLayout;
