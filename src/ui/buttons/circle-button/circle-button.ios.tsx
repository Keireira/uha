import React from 'react';

import { useTheme } from 'styled-components/native';
import { frame, glassEffect } from '@expo/ui/swift-ui/modifiers';

import { Button } from '@expo/ui/swift-ui';

import type { Props } from './circle-button.d';

const CircleButtonIOS = ({ size = 48, modifiers = [], ...restProps }: Props) => {
	const theme = useTheme();

	return (
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
						tint: `${theme.background.default}80`
					}
				}),
				...modifiers
			]}
			{...restProps}
		/>
	);
};

export default CircleButtonIOS;
