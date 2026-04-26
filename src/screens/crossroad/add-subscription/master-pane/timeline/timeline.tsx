import React, { useState } from 'react';
import { useRouter } from 'expo-router';
import { format, parseISO } from 'date-fns';
import { useTheme } from 'styled-components/native';

import { useDraftStore } from '../../hooks';
import { EVENT_META, eventSummary, type TimelineEventT } from '../../events';

import Root from './timeline.styles';
import { TimelineHeader, AddEventModal, AddEventButton, ErrorsBanner } from './components';
import { Host, List, Section, HStack, VStack, ZStack, Text, Image, Spacer, Circle, Rectangle } from '@expo/ui/swift-ui';
import {
	font,
	frame,
	opacity,
	listStyle,
	clipShape,
	onTapGesture,
	listRowInsets,
	scrollDisabled,
	deleteDisabled,
	foregroundStyle,
	listSectionMargins
} from '@expo/ui/swift-ui/modifiers';
import { withAlpha } from '@lib/colors';

// SwiftUI List is lazy and won't render rows outside the Host's frame,
// which is why we need this explicit size.
const ROW_HEIGHT = 70;

const Timeline = () => {
	const theme = useTheme();
	const router = useRouter();
	const [isPickerVisible, setIsPickerVisible] = useState(false);

	const timeline = useDraftStore((state) => state.timeline);
	const removeEvent = useDraftStore((state) => state.actions.removeEvent);

	const openEditor = (event: TimelineEventT) => () => {
		switch (event.type) {
			case 'trial': {
				router.push('/(crossroad)/trial-duration');
				return;
			}

			case 'first_payment': {
				router.push('/(crossroad)/first-payment-date');
				return;
			}

			default: {
				router.push({
					pathname: '/(pickers)/edit-event',
					params: {
						id: event.id
					}
				});
			}
		}
	};

	const onDeleteHd = (indices: number[]) => {
		const event = timeline[indices[0]];

		if (event && event.type !== 'first_payment') {
			removeEvent(event.id);
		}
	};

	return (
		<Root>
			<TimelineHeader />

			<Host style={{ height: timeline.length * ROW_HEIGHT }}>
				<List modifiers={[listStyle('insetGrouped'), scrollDisabled(true), clipShape('roundedRectangle', 16)]}>
					<Section modifiers={[listSectionMargins({ length: 0, edges: 'all' })]}>
						<List.ForEach onDelete={onDeleteHd}>
							{timeline.map((event, index, arr) => {
								const isFirst = index === 0;
								const isLast = index === arr.length - 1;

								const meta = EVENT_META[event.type];
								const tone = theme.accents[meta.accent];

								const summary = eventSummary(event);

								return (
									<HStack
										key={event.id}
										spacing={12}
										alignment="center"
										modifiers={[
											frame({ height: ROW_HEIGHT }),
											listRowInsets({ leading: 16, trailing: 16 }),
											deleteDisabled(event.type === 'first_payment'),
											onTapGesture(openEditor(event))
										]}
									>
										{/* Icon block */}
										<ZStack>
											{/* Connecting vertical line of timeline */}
											<VStack>
												{/* Upper one */}
												<Rectangle
													modifiers={[
														foregroundStyle(withAlpha(theme.text.tertiary, 0.2)),
														frame({ width: 2, maxHeight: 9999 }),
														opacity(isFirst ? 0 : 1)
													]}
												/>

												{/* Lower one */}
												<Rectangle
													modifiers={[
														foregroundStyle(withAlpha(theme.text.tertiary, 0.2)),
														frame({ width: 2, maxHeight: 9999 }),
														opacity(isLast ? 0 : 1)
													]}
												/>
											</VStack>

											{/* Outer circle */}
											<Circle modifiers={[frame({ width: 36, height: 36 }), foregroundStyle(withAlpha(tone, 0.2))]} />
											{/* Icon's bg */}
											<Circle modifiers={[frame({ width: 24, height: 24 }), foregroundStyle(tone)]} />
											{/* Icon */}
											<Image systemName={meta.symbol} size={12} color={theme.static.white} />
										</ZStack>

										{/* Info + Desc block */}
										<VStack alignment="leading" spacing={4}>
											<Text modifiers={[font({ size: 16, weight: 'semibold' }), foregroundStyle(tone)]}>
												{meta.label}
											</Text>

											{Boolean(summary) && (
												<Text modifiers={[font({ size: 14, weight: 'medium' }), foregroundStyle(theme.text.primary)]}>
													{summary}
												</Text>
											)}
										</VStack>

										<Spacer />

										{/* Date block */}
										<HStack spacing={4}>
											<Text modifiers={[font({ size: 14, weight: 'medium' }), foregroundStyle(theme.text.secondary)]}>
												{format(parseISO(event.date), 'MMM d, yyyy')}
											</Text>

											<Image systemName="chevron.right" size={12} color={theme.text.secondary} />
										</HStack>
									</HStack>
								);
							})}
						</List.ForEach>
					</Section>
				</List>
			</Host>

			<AddEventButton setIsPickerVisible={setIsPickerVisible} />

			<ErrorsBanner />

			<AddEventModal isPickerVisible={isPickerVisible} setIsPickerVisible={setIsPickerVisible} />
		</Root>
	);
};

export default Timeline;
