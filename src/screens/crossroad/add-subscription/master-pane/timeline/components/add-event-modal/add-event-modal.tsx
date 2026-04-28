import React, { useMemo } from 'react';
import { useRouter } from 'expo-router';
import { useTheme } from 'styled-components/native';

import { splitEvery } from 'ramda';
import { withAlpha } from '@lib/colors';
import { useDraftStore } from '@screens/crossroad/add-subscription/hooks';

import { BottomSheet, Image, Text, VStack, HStack, ScrollView } from '@expo/ui/swift-ui';
import { glassEffect, padding, foregroundStyle, onTapGesture, font, textCase } from '@expo/ui/swift-ui/modifiers';

import { EVENT_META, EVENT_ORDER, availableEventTypes } from '@screens/crossroad/add-subscription/events';

import type { Props } from './add-event-modal.d';
import type { EventTypeT } from '@screens/crossroad/add-subscription/events';

const useEventTypes = () => {
	const timeline = useDraftStore((store) => store.timeline);

	const rows = useMemo(() => {
		const eventTypes = availableEventTypes(timeline);
		const filteredTypes = EVENT_ORDER.filter((type) => eventTypes.has(type));

		return splitEvery(3, filteredTypes);
	}, [timeline]);

	return rows;
};

const AddEventModal = ({ isPickerVisible, setIsPickerVisible }: Props) => {
		const theme = useTheme();
		const router = useRouter();

		const eventTypeRows = useEventTypes();
		const enableTrial = useDraftStore((state) => state.actions.enableTrial);

		const handleTypeSelect = (type: EventTypeT) => {
			if (type === 'trial') {
				enableTrial();

			router.push({
				pathname: '/(crossroad)/trial-duration',
				params: {
					from: 'timeline'
				}
			});

			setIsPickerVisible(false);

			return;
		}

		router.push({
			pathname: '/(crossroad)/edit-event',
			params: {
				type
			}
		});

		setIsPickerVisible(false);
	};

	return (
		<VStack>
			<BottomSheet isPresented={isPickerVisible} onIsPresentedChange={setIsPickerVisible} fitToContents>
				<VStack>
					<Text
						modifiers={[
							padding({ top: 32, bottom: 8 }),
							font({ size: 14, weight: 'semibold' }),
							foregroundStyle(theme.text.secondary),
							textCase('uppercase')
						]}
					>
						Pick event type
					</Text>

					<ScrollView axes="horizontal" showsIndicators={false} modifiers={[padding({ all: 8 })]}>
						<VStack spacing={8} modifiers={[padding({ all: 8 })]}>
							{eventTypeRows.map((row, rowIndex) => {
								return (
									<HStack key={rowIndex} spacing={8} alignment="center">
										{row.map((type) => {
											const meta = EVENT_META[type];
											const tone = theme.accents[meta.accent];
											const onPressHd = () => handleTypeSelect(type);

											return (
												<HStack
													key={type}
													spacing={8}
													alignment="center"
													modifiers={[
														foregroundStyle(tone),
														padding({ vertical: 10, horizontal: 16 }),
														glassEffect({
															glass: {
																interactive: true,
																variant: 'regular',
																tint: withAlpha(tone, 0.2)
															},
															shape: 'capsule'
														}),
														onTapGesture(onPressHd)
													]}
												>
													<Image size={14} systemName={meta.symbol} color={tone} />

													<Text modifiers={[font({ size: 17 })]}>{meta.label}</Text>
												</HStack>
											);
										})}
									</HStack>
								);
							})}
						</VStack>
					</ScrollView>
				</VStack>
			</BottomSheet>
		</VStack>
	);
};

export default AddEventModal;
