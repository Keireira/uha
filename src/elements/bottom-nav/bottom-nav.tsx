import React, { useEffect } from 'react';
import { useUnit } from 'effector-react';
import { useAppModel } from '@models';
import * as Haptics from 'expo-haptics';
import { Pressable, useColorScheme } from 'react-native';
import { useAnimatedStyle, useSharedValue, withSpring } from 'react-native-reanimated';

import { ListIcon, CalendarIcon, SettingsIcon, LibraryIcon } from '@ui/icons';
import Root, { GradientRoot, Gradient, BurpView, TabButton } from './bottom-nav.styles';

import type { Props } from './bottom-nav.d';

const ANIMATION_CONFIG = {
	mass: 0.35,
	damping: 30,
	stiffness: 210
};

const BottomNav = ({ children, ...props }: Props) => {
	const { scroll } = useAppModel();
	const direction = useUnit(scroll.$direction);

	const colorScheme = useColorScheme();
	const tint = colorScheme === 'dark' ? 'dark' : 'light';

	const bottom = useSharedValue(18);
	const shadow = useSharedValue(120);
	const animatedStyle = useAnimatedStyle(() => ({
		bottom: bottom.value
	}));

	const shadowAnimatedStyle = useAnimatedStyle(() => ({
		height: shadow.value
	}));

	useEffect(() => {
		if (direction === 'down') {
			bottom.value = withSpring(-48, ANIMATION_CONFIG);
			shadow.value = withSpring(48, ANIMATION_CONFIG);
		} else {
			bottom.value = withSpring(18, ANIMATION_CONFIG);
			shadow.value = withSpring(120, ANIMATION_CONFIG);
		}
	}, [direction]);

	const onPress = () => {
		scroll.setDirection('up');
	};

	return (
		<React.Fragment>
			<GradientRoot style={shadowAnimatedStyle}>
				<Gradient colors={['transparent', 'rgba(0, 0, 0, 0.08)']} />
			</GradientRoot>

			<Root {...props} style={[animatedStyle, { boxShadow: 'rgba(0, 0, 0, 0.1) 0px 2px 4px' }]}>
				<Pressable onPress={onPress}>
					<BurpView intensity={25} tint={tint}>
						{children}
					</BurpView>
				</Pressable>
			</Root>
		</React.Fragment>
	);
};

const NavbarButton = ({ style, ...props }: React.ComponentProps<typeof TabButton>) => {
	return (
		<TabButton
			{...props}
			onPress={(event) => {
				Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);

				if (props.onPress) {
					props.onPress(event);
				}
			}}
		/>
	);
};

BottomNav.Button = NavbarButton;

type IconProps = {
	name: 'list' | 'library' | 'search' | 'settings';
};

const NavbarIcon = ({ name }: IconProps) => {
	const colorScheme = useColorScheme();
	const iconColor = colorScheme === 'dark' ? '#fafafa' : '#333333';

	switch (name) {
		case 'list':
			return <ListIcon color={iconColor} />;
		case 'library':
			return <CalendarIcon color={iconColor} />;
		case 'search':
			return <LibraryIcon color={iconColor} />;
		case 'settings':
			return <SettingsIcon color={iconColor} />;
	}

	return null;
};

BottomNav.Icon = NavbarIcon;

export default BottomNav;
