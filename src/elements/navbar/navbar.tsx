import React, { useEffect } from 'react';
import { useUnit } from 'effector-react';
import { useTheme } from 'styled-components/native';
import { useAppModel } from '@models';
import * as Haptics from 'expo-haptics';
import { Pressable } from 'react-native';
import { useAnimatedStyle, useSharedValue, withSpring } from 'react-native-reanimated';

import { ListIcon, CalendarIcon, SettingsIcon, LibraryIcon, AddIcon } from '@ui/icons';
import Root, { GradientRoot, Gradient, BurpView, TabButton, CircleRoot } from './navbar.styles';

import type { Props } from './navbar.d';
import type { GestureResponderEvent } from 'react-native';

const ANIMATION_CONFIG = {
	mass: 0.35,
	damping: 30,
	stiffness: 210
};

const BottomNav = ({ children, ...props }: Props) => {
	const theme = useTheme();
	const { scroll } = useAppModel();
	const direction = useUnit(scroll.$direction);

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
			{/* This is not a background of navbar. This is a shadow under navbar. */}
			<GradientRoot style={shadowAnimatedStyle}>
				<Gradient colors={['transparent', `${theme.shadow.default}16`]} />
			</GradientRoot>

			<Root
				{...props}
				style={[
					animatedStyle,
					{
						boxShadow: `0 0 6px 1px ${theme.shadow.default}20`,
						elevation: 2
					}
				]}
			>
				<Pressable onPress={onPress}>
					<BurpView intensity={25} tint={theme.tint}>
						{children}
					</BurpView>
				</Pressable>
			</Root>
		</React.Fragment>
	);
};

const NavbarButton = ({ style, ...props }: React.ComponentProps<typeof TabButton>) => {
	const onPressHd = (event: GestureResponderEvent) => {
		Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);

		if (props.onPress) {
			props.onPress(event);
		}
	};

	return <TabButton {...props} onPress={onPressHd} />;
};

BottomNav.Button = NavbarButton;

type IconProps = {
	isInverted?: boolean;
	name: 'list' | 'library' | 'calendar' | 'settings' | 'add';
};

const NavbarIcon = ({ name }: IconProps) => {
	const theme = useTheme();

	switch (name) {
		case 'list':
			return <ListIcon color={theme.text.primary} />;
		case 'calendar':
			return <CalendarIcon color={theme.text.primary} />;
		case 'library':
			return <LibraryIcon color={theme.text.primary} />;
		case 'settings':
			return <SettingsIcon color={theme.text.primary} />;
		case 'add':
			return <AddIcon color={theme.tint === 'dark' ? theme.text.primary : theme.text.inverse} />;
	}

	return null;
};

BottomNav.Icon = NavbarIcon;

const CircleButton = (props: React.ComponentProps<typeof CircleRoot>) => (
	<CircleRoot {...props}>
		<NavbarIcon name="add" />
	</CircleRoot>
);

BottomNav.CircleButton = CircleButton;

export default BottomNav;
