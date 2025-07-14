import React, { useEffect } from 'react';
import { useUnit } from 'effector-react';
import * as Haptics from 'expo-haptics';
import { useColorScheme } from 'react-native';
import { useAppModel } from '@models';
import { useAnimatedStyle, useSharedValue, withSpring } from 'react-native-reanimated';

import { ListIcon, CalendarIcon, SettingsIcon, LibraryIcon } from '@ui/icons';
import { BottomNavRoot, TabButton } from '@elements/bottom-nav';
import { Tabs, TabSlot, TabList, TabTrigger } from 'expo-router/ui';

const TabLayout = () => {
	const { scroll } = useAppModel();
	const direction = useUnit(scroll.$direction);

	const colorScheme = useColorScheme();
	const iconColor = colorScheme === 'dark' ? '#fafafa' : '#333333';

	const bottom = useSharedValue(0);
	const animatedStyle = useAnimatedStyle(() => {
		return {
			bottom: bottom.value
		};
	});

	useEffect(() => {
		if (direction === 'down') {
			bottom.value = withSpring(-48, {
				mass: 0.35,
				damping: 30,
				stiffness: 210
			});
		} else {
			bottom.value = withSpring(24, {
				mass: 0.35,
				damping: 30,
				stiffness: 210
			});
		}
	}, [direction]);

	return (
		<Tabs>
			<TabSlot />

			<TabList asChild>
				<BottomNavRoot style={animatedStyle}>
					<TabTrigger name="home" href="/" asChild>
						<TabButton
							style={{ justifyContent: 'center' }}
							onPress={() => {
								Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
							}}
						>
							<ListIcon color={iconColor} />
						</TabButton>
					</TabTrigger>

					<TabTrigger name="library" href="/library" asChild>
						<TabButton
							style={{ justifyContent: 'center' }}
							onPress={() => {
								Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
							}}
						>
							<CalendarIcon color={iconColor} />
						</TabButton>
					</TabTrigger>

					<TabTrigger name="search" href="/search" asChild>
						<TabButton
							style={{ justifyContent: 'center' }}
							onPress={() => {
								Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
							}}
						>
							<LibraryIcon color={iconColor} />
						</TabButton>
					</TabTrigger>

					<TabTrigger name="settings" href="/settings" asChild>
						<TabButton
							style={{ justifyContent: 'center' }}
							onPress={() => {
								Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
							}}
						>
							<SettingsIcon color={iconColor} />
						</TabButton>
					</TabTrigger>
				</BottomNavRoot>
			</TabList>
		</Tabs>
	);
};

export default TabLayout;
