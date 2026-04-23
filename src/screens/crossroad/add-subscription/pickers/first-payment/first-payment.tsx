import React from 'react';

import { Header, Calendar } from './components';
import { PickerBanner } from '@screens/crossroad/add-subscription/components';
import Root, { Content } from './first-payment.styles';

const FirstPayment = () => {
	return (
		<Root
			contentContainerStyle={{
				paddingHorizontal: 24,
				paddingBottom: 36
			}}
		>
			<Header />

			<Content>
				<Calendar />
			</Content>

			<PickerBanner
				title="Editing first payment event"
				description="Date changes apply directly to the first payment on the timeline."
			/>
		</Root>
	);
};

export default FirstPayment;
