import React from 'react';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Text } from 'react-native';
import Root from './txs-calendar.styles';

const TxsCalendar = () => {
	const insets = useSafeAreaInsets();

	return (
		<Root $top={insets.top} $bottom={insets.bottom}>
			<Text>Calendar View</Text>
		</Root>
	);
};

export default TxsCalendar;
