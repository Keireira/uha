import React from 'react';

import { Navbar } from '@elements';
import { Tabs, TabSlot, TabList, TabTrigger } from 'expo-router/ui';

const TabLayout = () => (
	<Tabs>
		<TabSlot />

		<TabList asChild>
			<Navbar>
				<TabTrigger name="home" href="/" asChild>
					<Navbar.Button>
						<Navbar.Icon name="list" />
					</Navbar.Button>
				</TabTrigger>

				<TabTrigger name="library" href="/library" asChild>
					<Navbar.Button>
						<Navbar.Icon name="library" />
					</Navbar.Button>
				</TabTrigger>

				<TabTrigger name="search" href="/search" asChild>
					<Navbar.Button>
						<Navbar.Icon name="search" />
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

export default TabLayout;
