import React from 'react';
import { View, Text } from 'react-native';

import type { PropsT } from './preview-item.d';

const PreviewItem = ({ title, emoji, color }: PropsT) => {
	return (
		<View>
			<Text>{title}</Text>
			<Text>{emoji}</Text>
			<Text>{color}</Text>
		</View>
	);
};

export default PreviewItem;
