import React from 'react';
import { Text } from 'react-native';

import Root from './preview-item.styles';

import type { PropsT } from './preview-item.d';

const PreviewItem = ({ title, emoji, color }: PropsT) => {
	return (
		<Root $color={color}>
			<Text>{emoji}</Text>
			<Text>{title}</Text>
		</Root>
	);
};

export default PreviewItem;
