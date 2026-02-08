import React from 'react';
import { useTheme } from 'styled-components/native';
import { background, opacity } from '@expo/ui/swift-ui/modifiers';

import { Divider as SwiftUIDivider } from '@expo/ui/swift-ui';
import Root from './divider.styles';

import type { Props } from './divider.d';

const Divider = ({ gap = 24, modifiers = [] }: Props) => {
	const theme = useTheme();

	return (
		<Root $gap={gap}>
			<SwiftUIDivider modifiers={[background(theme.border.default), opacity(0.4), ...modifiers]} />
		</Root>
	);
};

export default Divider;
