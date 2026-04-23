import React from 'react';
import { useShallow } from 'zustand/react/shallow';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { useDraftStore } from '@screens/crossroad/add-subscription/hooks';

import { Header, Presets, Units } from './components';
import { StepperField } from '@screens/crossroad/add-subscription/components';
import Root, { Content, Title } from './trial-duration.styles';

const TrialDurationScreen = () => {
	const insets = useSafeAreaInsets();

	const { type, value, setTrialDuration } = useDraftStore(
		useShallow((state) => ({
			type: state.trial_duration_type,
			value: state.trial_duration_value,
			setTrialDuration: state.actions.setTrialDuration
		}))
	);

	return (
		<Root
			contentContainerStyle={{
				gap: 16,
				paddingTop: 24,
				paddingHorizontal: 24,
				paddingBottom: Math.max(insets.bottom, 64)
			}}
		>
			<Header />

			<Content>
				<Title>Presets</Title>
				<Presets />

				<Title>Custom</Title>
				<StepperField type={type} value={value} setValue={setTrialDuration} />

				<Units />
			</Content>
		</Root>
	);
};

export default TrialDurationScreen;
