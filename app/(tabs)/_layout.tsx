import React, { useState } from 'react';
import { useUnit } from 'effector-react';
// import { Platform } from 'react-native';

import { useAppModel } from '@models';

import { Navbar, Crossroad } from '@elements';
import { Tabs, TabSlot, TabList, TabTrigger } from 'expo-router/ui';
// import { NativeTabs, Icon, Label } from 'expo-router/unstable-native-tabs';

const TabLayout = () => {
	const { view_mode } = useAppModel();
	const viewMode = useUnit(view_mode.$mode);

	const [isModalOpened, setIsModalOpened] = useState(false);
	// const isiOS26 = Platform.OS === 'ios' && Number.parseInt(`${Platform.Version}`, 10) >= 26;

	// if (isiOS26) {
	// 	return (
	// 		<NativeTabs minimizeBehavior="onScrollDown">
	// 			<NativeTabs.Trigger name="index">
	// 				<Icon sf="list.bullet" />
	// 				<Label hidden>Home</Label>
	// 			</NativeTabs.Trigger>

	// 			<NativeTabs.Trigger name="calendar">
	// 				<Icon sf="calendar" />
	// 				<Label hidden>Home</Label>
	// 			</NativeTabs.Trigger>

	// 			<NativeTabs.Trigger name="library">
	// 				<Icon sf="books.vertical" />
	// 				<Label hidden>Library</Label>
	// 			</NativeTabs.Trigger>

	// 			<NativeTabs.Trigger name="settings">
	// 				<Icon sf="gearshape" />
	// 				<Label hidden>Settings</Label>
	// 			</NativeTabs.Trigger>

	// 			<NativeTabs.Trigger name="search" role="search">
	// 				<Icon sf="plus" />
	// 			</NativeTabs.Trigger>
	// 		</NativeTabs>
	// 	);
	// }

	return (
		<>
			<Tabs>
				<TabSlot />

				<TabList asChild>
					<Navbar>
						<TabTrigger name="home" href="/" asChild>
							<Navbar.Button>
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
