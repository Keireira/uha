import React, { useEffect } from 'react';
import { useUnit } from 'effector-react';
import { useAppModel } from '@models';
import * as Haptics from 'expo-haptics';
import { Pressable, useColorScheme } from 'react-native';
import { useAnimatedStyle, useSharedValue, withSpring } from 'react-native-reanimated';

import { ListIcon, CalendarIcon, SettingsIcon, LibraryIcon, AddIcon } from '@ui/icons';
import Root, { GradientRoot, Gradient, BurpView, TabButton, CircleRoot } from './navbar.styles';

import type { Props } from './navbar.d';

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
	isInverted?: boolean;
	name: 'list' | 'library' | 'calendar' | 'settings' | 'add';
};

const NORMAL_THEME_MAP = { dark: '#fafafa', light: '#333333' };
const INVERTED_THEME_MAP = { dark: NORMAL_THEME_MAP.light, light: NORMAL_THEME_MAP.dark };

const NavbarIcon = ({ name, isInverted = false }: IconProps) => {
	const colorScheme = useColorScheme() || 'light';
	const iconColor = isInverted ? INVERTED_THEME_MAP[colorScheme] : NORMAL_THEME_MAP[colorScheme];

	switch (name) {
		case 'list':
			return <ListIcon color={iconColor} />;
		case 'calendar':
			return <CalendarIcon color={iconColor} />;
		case 'library':
			return <LibraryIcon color={iconColor} />;
		case 'settings':
			return <SettingsIcon color={iconColor} />;
		case 'add':
			return <AddIcon color={iconColor} />;
	}

	return null;
};

BottomNav.Icon = NavbarIcon;

const CircleButton = (props: React.ComponentProps<typeof CircleRoot>) => {
	const colorScheme = useColorScheme() || 'light';

	return (
		<CircleRoot {...props}>
			<NavbarIcon name="add" isInverted={colorScheme === 'light'} />
		</CircleRoot>
	);
};

BottomNav.CircleButton = CircleButton;

export default BottomNav;
