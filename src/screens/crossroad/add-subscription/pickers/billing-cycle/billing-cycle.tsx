import React from 'react';
import { useShallow } from 'zustand/react/shallow';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { useDraftStore } from '@screens/crossroad/add-subscription/hooks';

import { Header, Presets, Units } from './components';
import { StepperField } from '@screens/crossroad/add-subscription/components';
import Root, { Content, Title } from './billing-cycle.styles';

const BillingCycleScreen = () => {
	const insets = useSafeAreaInsets();

	const { type, value, setBillingCycle } = useDraftStore(
		useShallow((state) => ({
			type: state.billing_cycle_type,
			value: state.billing_cycle_value,
			setBillingCycle: state.actions.setBillingCycle
		}))
	);

	return (
		<Root
			contentContainerStyle={{
				gap: 16,
				paddingTop: 24,
				paddingHorizontal: 16,
				justifyContent: 'center',
				paddingBottom: insets.bottom
			}}
		>
			<Header />

			<Content>
				<Title>Presets</Title>
				<Presets />

				<Title>Custom</Title>
				<StepperField type={type} value={value} setValue={setBillingCycle} />
				<Units />
			</Content>
		</Root>
	);
};

export default BillingCycleScreen;
