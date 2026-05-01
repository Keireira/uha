import React, { useState } from 'react';
import { useRouter } from 'expo-router';
import { format, parseISO } from 'date-fns';
import { useTheme } from 'styled-components/native';

import { withAlpha } from '@lib/colors';
import { useDraftStore } from '@screens/crossroad/add-subscription/hooks';
import { EVENT_META, eventSummary, type TimelineEventT } from '@screens/crossroad/add-subscription/events';

import {
	RNHostView,
	List,
	Section,
	HStack,
	VStack,
	ZStack,
	Text,
	Image,
	Spacer,
	Circle,
	Rectangle
} from '@expo/ui/swift-ui';
import {
	font,
	frame,
	opacity,
	lineLimit,
	onTapGesture,
	listRowInsets,
	listRowSeparator,
	listRowBackground,
	listSectionSpacing,
	deleteDisabled,
	foregroundStyle,
	listSectionMargins
} from '@expo/ui/swift-ui/modifiers';
import { AddEventModal, AddEventButton, ErrorsBanner } from './components';

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
					pathname: '/(crossroad)/edit-event',
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
		<>
			<Section title="Timeline" modifiers={[listSectionMargins({ length: 0, edges: 'vertical' })]}>
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
									frame({ height: 70 }),
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
												frame({ width: 2, maxHeight: Number.POSITIVE_INFINITY }),
												opacity(isFirst ? 0 : 1)
											]}
										/>

										{/* Lower one */}
										<Rectangle
											modifiers={[
												foregroundStyle(withAlpha(theme.text.tertiary, 0.2)),
												frame({ width: 2, maxHeight: Number.POSITIVE_INFINITY }),
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
									<Text modifiers={[font({ design: 'rounded', size: 16, weight: 'semibold' }), foregroundStyle(tone)]}>
										{meta.label}
									</Text>

									{Boolean(summary) && (
										<Text
											modifiers={[
												font({ design: 'rounded', size: 14, weight: 'medium' }),
												foregroundStyle(theme.text.primary),
												lineLimit(1)
											]}
										>
											{summary}
										</Text>
									)}
								</VStack>

								<Spacer />

								{/* Date block */}
								<HStack spacing={4}>
									<Text
										modifiers={[
											font({ design: 'rounded', size: 14, weight: 'medium' }),
											foregroundStyle(theme.text.secondary)
										]}
									>
										{format(parseISO(event.date), 'MMM d, yyyy')}
									</Text>

									<Image systemName="chevron.right" size={12} color={theme.text.secondary} />
								</HStack>
							</HStack>
						);
					})}
				</List.ForEach>
			</Section>

			<Section modifiers={[listRowBackground('transparent'), listRowSeparator('hidden'), listSectionSpacing(0)]}>
				<RNHostView matchContents>
					<>
						<AddEventButton setIsPickerVisible={setIsPickerVisible} />

						<ErrorsBanner />
					</>
				</RNHostView>
			</Section>

			<Section modifiers={[listRowBackground('transparent'), listRowSeparator('hidden'), listSectionSpacing(0)]}>
				<AddEventModal isPickerVisible={isPickerVisible} setIsPickerVisible={setIsPickerVisible} />
			</Section>
		</>
	);
};

export default Timeline;
