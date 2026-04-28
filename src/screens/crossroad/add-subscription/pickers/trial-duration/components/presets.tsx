import React from 'react';

import MaskedView from '@react-native-masked-view/masked-view';
import { LinearGradient } from 'expo-linear-gradient';

import { useAccent } from '@hooks';
import { useShallow } from 'zustand/react/shallow';
import { useDraftStore } from '@screens/crossroad/add-subscription/hooks';
import { selectTrialDuration } from '@screens/crossroad/add-subscription/events';

import { withAlpha } from '@lib/colors';
import { Host, ScrollView, HStack, Text } from '@expo/ui/swift-ui';
import { glassEffect, padding, foregroundStyle, onTapGesture, font } from '@expo/ui/swift-ui/modifiers';

import type { BillingCycleT } from '@screens/crossroad/add-subscription/events';

type PresetT = {
	type: BillingCycleT;
	value: number;
};

const PRESETS: (PresetT & { label: string })[] = [
	{ label: '3 days', type: 'days', value: 3 },
	{ label: '1 week', type: 'weeks', value: 1 },
	{ label: '2 weeks', type: 'weeks', value: 2 },
	{ label: '30 days', type: 'days', value: 30 },
	{ label: '1 month', type: 'months', value: 1 },
	{ label: '60 days', type: 'days', value: 60 },
	{ label: '3 months', type: 'months', value: 3 }
];

const Presets = () => {
	const settingAccent = useAccent();

		const { type, value, setTrialDuration } = useDraftStore(
			useShallow((state) => ({
				type: selectTrialDuration(state.timeline)?.duration_type ?? 'days',
				value: selectTrialDuration(state.timeline)?.duration_value ?? 7,
				setTrialDuration: state.actions.setTrialDuration
			}))
		);

	return (
		<MaskedView
			style={{ marginBottom: 28 }}
			maskElement={
				<LinearGradient
					colors={['transparent', 'black', 'black', 'transparent']}
					locations={[0, 0.03, 0.97, 1]}
					start={{ x: 0, y: 0 }}
					end={{ x: 1, y: 0 }}
					style={{ flex: 1 }}
				/>
			}
		>
			<Host matchContents>
				<ScrollView axes="horizontal" showsIndicators={false}>
					<HStack spacing={14} modifiers={[padding({ vertical: 8, horizontal: 8 })]}>
						{PRESETS.map((preset) => {
							const isActive = preset.type === type && preset.value === value;
							const onPressHd = () => setTrialDuration(preset.type, preset.value);

							return (
								<Text
									key={preset.label}
									modifiers={[
										font({ size: 17 }),
										padding({
											vertical: 12,
											horizontal: 18
										}),
										foregroundStyle(isActive ? settingAccent : { type: 'hierarchical', style: 'primary' }),
										glassEffect({
											glass: {
												variant: 'regular',
												interactive: true,
												...(isActive && { tint: withAlpha(settingAccent, 0.22) })
											},
											shape: 'capsule'
										}),
										onTapGesture(onPressHd)
									]}
								>
									{preset.label}
								</Text>
							);
						})}
					</HStack>
				</ScrollView>
			</Host>
		</MaskedView>
	);
};

export default Presets;
