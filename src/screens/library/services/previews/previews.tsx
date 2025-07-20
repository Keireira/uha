import React from 'react';
import { useAppModel } from '@models';
import { useUnit } from 'effector-react';

import { View, Text } from 'react-native';
import PreviewItem from './preview-item';

const Previews = () => {
	const { services } = useAppModel();
	const servicesList = useUnit(services.$services);

	return (
		<View>
			<Text>Service Previews</Text>

			{servicesList.map((service) => (
				<PreviewItem key={service.id} {...service} />
			))}
		</View>
	);
};

export default Previews;
