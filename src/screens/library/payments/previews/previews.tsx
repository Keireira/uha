import React from 'react';
import { useAppModel } from '@models';
import { useUnit } from 'effector-react';

import { View, Text } from 'react-native';
import PreviewItem from './preview-item';

const Previews = () => {
	const { payments } = useAppModel();
	const paymentsList = useUnit(payments.$payments);

	return (
		<View>
			<Text>Payment Previews</Text>

			{paymentsList.map((payment) => (
				<PreviewItem key={payment.id} {...payment} />
			))}
		</View>
	);
};

export default Previews;
