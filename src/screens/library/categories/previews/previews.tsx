import React from 'react';
import { useAppModel } from '@models';
import { useUnit } from 'effector-react';

import { View, Text } from 'react-native';
import PreviewItem from './preview-item';

const Previews = () => {
	const { categories } = useAppModel();
	const categoriesList = useUnit(categories.$categories);

	return (
		<View>
			<Text>Category Previews</Text>

			{categoriesList.map((category) => (
				<PreviewItem key={category.id} {...category} />
			))}
		</View>
	);
};

export default Previews;
