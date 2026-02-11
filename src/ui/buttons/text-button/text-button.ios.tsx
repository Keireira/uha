import React from 'react';

import { Text } from '../../typography';
import { Host, Button } from '@expo/ui/swift-ui';
import { useTheme } from 'styled-components/native';
import { glassEffect } from '@expo/ui/swift-ui/modifiers';

import type { Props } from './text-button.d';

const TextButtonIOS = ({ size = 42, modifiers = [], glassTint, title, color, ...restProps }: Props) => {
	const theme = useTheme();

	return (
		<Host matchContents>
			<Button
				variant="plain"
				controlSize="large"
				modifiers={[
					glassEffect({
						shape: 'capsule',
						glass: {
							interactive: true,
							variant: 'regular',
							tint: glassTint || theme.background.default
						}
					}),
					...modifiers
				]}
				{...restProps}
			>
				<Text
					style={{ paddingHorizontal: 12, paddingVertical: 4 }}
					adjustsFontSizeToFit
					numberOfLines={1}
					minimumFontScale={0.5}
					$color={color || theme.text.primary}
				>
					{title}
				</Text>
			</Button>
		</Host>
	);
};

export default TextButtonIOS;
