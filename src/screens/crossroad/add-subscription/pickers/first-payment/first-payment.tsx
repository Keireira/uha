import React from 'react';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Header, Calendar } from './components';
import Root, { Content } from './first-payment.styles';

const FirstPayment = () => {
	const insets = useSafeAreaInsets();

	return (
		<Root
			contentContainerStyle={{
				paddingHorizontal: 24,
				paddingBottom: Math.max(insets.bottom, 64)
			}}
		>
			<Header />

			<Content>
				<Calendar />
			</Content>
		</Root>
	);
};

export default FirstPayment;
