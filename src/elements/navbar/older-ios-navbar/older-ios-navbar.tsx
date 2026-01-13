/* Pathetic, pitiful imitation of ass effect from iOS 26 for iOS <= 18.6 */
import React from 'react';
import { useTheme } from 'styled-components/native';
import { useAppModel } from '@models';
import { Pressable } from 'react-native';
import { useAnimations } from './hooks';

import { NavbarIcon, NavbarButton, CircleButton } from './components';
import Root, { GradientRoot, Gradient, BurpView } from './older-ios-navbar.styles';

import type { Props } from './older-ios-navbar.d';

const OlderIOSNavbar = ({ children, ...props }: Props) => {
	const theme = useTheme();
	const { scroll } = useAppModel();
	const { gradientStyles, blurStyles } = useAnimations();

	const onPress = () => {
		scroll.setDirection('up');
	};

	return (
		<React.Fragment>
			{/* This is not a background of navbar. This is a shadow under navbar. */}
			<GradientRoot style={gradientStyles}>
				<Gradient colors={['transparent', `${theme.shadow.default}20`]} />
			</GradientRoot>

			<Root {...props} style={blurStyles}>
				<Pressable onPress={onPress}>
					<BurpView intensity={25} tint={theme.tint}>
						{children}
					</BurpView>
				</Pressable>
			</Root>
		</React.Fragment>
	);
};

OlderIOSNavbar.Icon = NavbarIcon;
// @TODO: Add behavior like double tap to scroll in start of the list
OlderIOSNavbar.Button = NavbarButton;
OlderIOSNavbar.CircleButton = CircleButton;

export default OlderIOSNavbar;
