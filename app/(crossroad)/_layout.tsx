import React, { useState } from 'react';
import { useRouter, Slot } from 'expo-router';

import { Navbar, Crossroad } from '@elements';

const TabLayout = () => {
	const router = useRouter();
	const [isModalOpened, setIsModalOpened] = useState(false);

	return (
		<>
			<Slot />

			<Navbar>
				<Navbar.Button onPress={() => router.push('/(tabs)')}>
					<Navbar.Icon name="list" />
				</Navbar.Button>

				<Navbar.Button onPress={() => router.push('/(tabs)/calendar')}>
					<Navbar.Icon name="calendar" />
				</Navbar.Button>

				<Navbar.CircleButton onPress={() => setIsModalOpened(true)} />

				<Navbar.Button onPress={() => router.push('/(tabs)/library')}>
					<Navbar.Icon name="library" />
				</Navbar.Button>

				<Navbar.Button onPress={() => router.push('/(tabs)/settings')}>
					<Navbar.Icon name="settings" />
				</Navbar.Button>
			</Navbar>

			<Crossroad isOpened={isModalOpened} onIsOpenedChange={setIsModalOpened} />
		</>
	);
};

export default TabLayout;
