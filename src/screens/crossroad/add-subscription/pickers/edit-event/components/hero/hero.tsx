import React from 'react';
import { withAlpha } from '@lib/colors';
import { useTheme } from 'styled-components/native';
import { useEventMeta } from '@screens/crossroad/add-subscription/pickers/edit-event/hooks';

import {
	font,
	bold,
	frame,
	padding,
	clipShape,
	background,
	glassEffect,
	foregroundStyle,
	listRowSeparator,
	listRowBackground,
	listSectionMargins,
	listSectionSpacing
} from '@expo/ui/swift-ui/modifiers';
import { Section, HStack, VStack, Image, Text, Spacer } from '@expo/ui/swift-ui';

import type { Props } from './hero.d';

const Hero = ({ activeType }: Props) => {
	const theme = useTheme();
	const meta = useEventMeta(activeType);

	if (!meta) {
		return null;
	}

	return (
		<Section
			modifiers={[
				listSectionSpacing(0),
				listRowSeparator('hidden'),
				listRowBackground('transparent'),
				listSectionMargins({ length: 0, edges: 'all' })
			]}
		>
			<HStack
				spacing={16}
				modifiers={[
					padding({ horizontal: 16, vertical: 14 }),
					glassEffect({
						glass: {
							interactive: false,
							variant: 'regular',
							tint: withAlpha(meta.tintColor, 0.2)
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
					modifiers={[frame({ width: 36, height: 36 }), background(meta.tintColor), clipShape('circle'), bold()]}
				/>
				<VStack alignment="leading" spacing={4}>
					<Text modifiers={[font({ size: 17, weight: 'semibold' }), foregroundStyle(meta.tintColor)]}>
						{meta.label}
					</Text>

					<Text
						modifiers={[font({ size: 17, weight: 'regular' }), foregroundStyle(withAlpha(theme.static.white, 0.75))]}
					>
						{meta.description}
					</Text>
				</VStack>

				<Spacer />
			</HStack>
		</Section>
	);
};

export default Hero;
