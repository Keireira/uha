import React from 'react';
import { withAlpha } from '@lib/colors';
import { useTheme } from 'styled-components/native';

import {
	font,
	bold,
	frame,
	padding,
	clipShape,
	background,
	glassEffect,
	foregroundStyle
} from '@expo/ui/swift-ui/modifiers';
import { HStack, VStack, Image, Text, Spacer } from '@expo/ui/swift-ui';

import { EVENT_META } from '@screens/crossroad/add-subscription/events';

import type { Props } from './hero.d';

const Hero = ({ activeType }: Props) => {
	const theme = useTheme();
	if (!activeType) return null;

	const meta = EVENT_META[activeType];
	const tintColor = theme.accents[meta.accent];

	return (
		<HStack
			spacing={16}
			modifiers={[
				padding({
					horizontal: 16,
					vertical: 14
				}),
				glassEffect({
					glass: {
						interactive: false,
						variant: 'regular',
						tint: withAlpha(tintColor, 0.2)
					},
					shape: 'roundedRectangle',
					cornerRadius: 24
				})
			]}
		>
			<Image
				size={16}
				systemName={meta.symbol}
				color={theme.static.white}
				modifiers={[frame({ width: 36, height: 36 }), background(tintColor), clipShape('circle'), bold()]}
			/>

			<VStack alignment="leading" spacing={4}>
				<Text modifiers={[font({ size: 17, weight: 'semibold' }), foregroundStyle(tintColor)]}>{meta.label}</Text>

				<Text modifiers={[font({ size: 17, weight: 'regular' }), foregroundStyle(withAlpha(theme.static.white, 0.75))]}>
					{meta.description}
				</Text>
			</VStack>

			<Spacer />
		</HStack>
	);
};

export default Hero;
