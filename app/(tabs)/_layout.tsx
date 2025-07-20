import React, { useState } from 'react';

import { Navbar, Crossroad } from '@elements';
import { Tabs, TabSlot, TabList, TabTrigger } from 'expo-router/ui';

const TabLayout = () => {
	const [isModalOpened, setIsModalOpened] = useState(false);

	return (
		<>
			<Tabs>
				<TabSlot />

				<TabList asChild>
					<Navbar>
						<TabTrigger name="home" href="/" asChild>
							<Navbar.Button>
								<Navbar.Icon name="list" />
							</Navbar.Button>
						</TabTrigger>

						<TabTrigger name="calendar" href="/calendar" asChild>
							<Navbar.Button>
								<Navbar.Icon name="calendar" />
							</Navbar.Button>
						</TabTrigger>

						<Navbar.CircleButton onPress={() => setIsModalOpened(true)} />

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

			<Crossroad isOpened={isModalOpened} onIsOpenedChange={setIsModalOpened} />
		</>
	);
};

export default TabLayout;
