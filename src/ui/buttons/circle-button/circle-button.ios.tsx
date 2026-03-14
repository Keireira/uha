import React from 'react';

import { Host, Button } from '@expo/ui/swift-ui';
import { useTheme } from 'styled-components/native';
import { frame, glassEffect, foregroundStyle, controlSize, labelStyle } from '@expo/ui/swift-ui/modifiers';

import type { Props } from './circle-button.d';

const CircleButtonIOS = ({ size = 42, modifiers = [], glassTint, symbolColor, label = '', ...restProps }: Props) => {
	const theme = useTheme();

	return (
		<Host matchContents>
			<Button
				modifiers={[
					controlSize('large'),
					labelStyle('iconOnly'),
					frame({
						width: size,
						height: size,
						alignment: 'center'
					}),
					glassEffect({
						shape: 'circle',
						glass: {
							interactive: true,
							variant: 'regular',
							tint: glassTint || theme.background.default
						}
					}),
					foregroundStyle({
						type: 'color',
						color: symbolColor || theme.text.primary
					}),
					...modifiers
				]}
				label={label}
				{...restProps}
			/>
		</Host>
	);
};

export default CircleButtonIOS;
