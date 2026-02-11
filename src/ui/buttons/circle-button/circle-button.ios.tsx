import React from 'react';

import { useTheme } from 'styled-components/native';
import { frame, glassEffect, foregroundStyle } from '@expo/ui/swift-ui/modifiers';

import { Host, Button } from '@expo/ui/swift-ui';

import type { Props } from './circle-button.d';

const CircleButtonIOS = ({ size = 42, modifiers = [], glassTint, symbolColor, ...restProps }: Props) => {
	const theme = useTheme();

	return (
		<Host matchContents>
			<Button
				variant="plain"
				controlSize="large"
				modifiers={[
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
							tint: glassTint || `${theme.background.default}80`
						}
					}),
					foregroundStyle({
						type: 'color',
						color: symbolColor || theme.text.primary
					}),
					...modifiers
				]}
				{...restProps}
			/>
		</Host>
	);
};

export default CircleButtonIOS;
