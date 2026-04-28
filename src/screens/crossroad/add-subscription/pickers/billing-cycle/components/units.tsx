import React from 'react';

import MaskedView from '@react-native-masked-view/masked-view';
import { LinearGradient } from 'expo-linear-gradient';

import { useAccent } from '@hooks';
import { useShallow } from 'zustand/react/shallow';
import { useDraftStore } from '@screens/crossroad/add-subscription/hooks';

import { withAlpha } from '@lib/colors';
import { Host, ScrollView, HStack, Text } from '@expo/ui/swift-ui';
import { glassEffect, padding, foregroundStyle, onTapGesture, font } from '@expo/ui/swift-ui/modifiers';

import type { BillingCycleT } from '@screens/crossroad/add-subscription/events';

const UNITS: BillingCycleT[] = ['days', 'weeks', 'months', 'years'];

const Units = () => {
	const settingAccent = useAccent();

	const { type, value, setBillingCycle } = useDraftStore(
		useShallow((state) => ({
			type: state.billing_cycle_type,
			value: state.billing_cycle_value,
			setBillingCycle: state.actions.setBillingCycle
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
						{UNITS.map((unit) => {
							const isActive = unit === type;
							const onPressHd = () => setBillingCycle(unit, value);

							return (
								<Text
									key={unit}
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
											shape: 'roundedRectangle',
											cornerRadius: 16
										}),
										onTapGesture(onPressHd)
									]}
								>
									{unit}
								</Text>
							);
						})}
					</HStack>
				</ScrollView>
			</Host>
		</MaskedView>
	);
};

export default Units;
