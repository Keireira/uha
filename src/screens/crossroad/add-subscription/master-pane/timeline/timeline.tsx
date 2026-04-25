import React, { useState } from 'react';
import { Modal } from 'react-native';
import { format, parseISO } from 'date-fns';
import { useRouter } from 'expo-router';
import { useTheme } from 'styled-components/native';
import { SymbolView } from 'expo-symbols';
import { useShallow } from 'zustand/react/shallow';

import {
	Host,
	List,
	Section,
	HStack,
	VStack,
	ZStack,
	Text,
	Image,
	Spacer,
	Circle,
	Rectangle,
	Picker
} from '@expo/ui/swift-ui';
import {
	listStyle,
	listRowSeparator,
	listRowInsets,
	listSectionMargins,
	frame,
	foregroundStyle,
	font,
	opacity,
	padding,
	scrollDisabled,
	deleteDisabled,
	onTapGesture,
	clipShape,
	pickerStyle,
	tag
} from '@expo/ui/swift-ui/modifiers';

import { withAlpha } from '@lib/colors';
import { useAccent, useGlassStyle } from '@hooks';
import { useDraftStore } from '../../hooks';
import {
	EVENT_META,
	EVENT_ORDER,
	availableEventTypes,
	eventSummary,
	timelineErrors,
	type EventTypeT,
	type TimelineEventT
} from '../../events';

import Root, {
	Header,
	Title,
	HeaderHint,
	ErrorBanner,
	ErrorTextBlock,
	ErrorLine,
	AddButton,
	AddPressable,
	AddLabel,
	TypePickerBackdrop,
	TypePickerSheet,
	TypePickerTitle,
	TypeChipGrid,
	TypeChipWrap,
	TypeChip,
	TypeChipLabel
} from './timeline.styles';

const styles = ['automatic', 'plain', 'inset', 'insetGrouped', 'grouped', 'sidebar'] as const;

const Timeline = () => {
	const router = useRouter();
	const theme = useTheme();
	const accent = useAccent();
	const glassEffectStyle = useGlassStyle();
	const [styleIndex, setStyleIndex] = useState(0);

	const { events, removeEvent, setWithTrial } = useDraftStore(
		useShallow((state) => ({
			events: state.timeline,
			removeEvent: state.actions.removeEvent,
			setWithTrial: state.actions.setWithTrial
		}))
	);

	const [pickerVisible, setPickerVisible] = useState(false);
	const availableTypes = availableEventTypes(events);
	const errors = timelineErrors(events);

	const openEditor = (event: TimelineEventT) => () => {
		// Trial / first_payment have their own full-featured pickers elsewhere —
		// reuse them instead of the generic edit-event sheet. The `from=timeline`
		// flag lets those pickers render a contextual banner.
		if (event.type === 'trial') {
			router.push('/(crossroad)/trial-duration');
			return;
		}
		if (event.type === 'first_payment') {
			router.push('/(crossroad)/first-payment-date');
			return;
		}

		router.push({
			pathname: '/(pickers)/edit-event',
			params: { id: event.id }
		});
	};

	const openTypePicker = () => setPickerVisible(true);
	const closeTypePicker = () => setPickerVisible(false);

	const handleTypeSelect = (type: EventTypeT) => () => {
		setPickerVisible(false);

		// Trial has its own picker. Materialize the event first (with a safe
		// default start date derived from first_payment_date − duration) so the
		// dedicated screen always has something to edit.
		if (type === 'trial') {
			setWithTrial(true);
			router.push({
				pathname: '/(crossroad)/trial-duration',
				params: { from: 'timeline' }
			});
			return;
		}

		router.push({
			pathname: '/(pickers)/edit-event',
			params: { type }
		});
	};

	const handleDeleteIndices = (indices: number[]) => {
		// SwiftUI delivers indices into the rendered events array — translate
		// them to ids and remove from the highest first to avoid shifting.
		const sorted = [...indices].sort((a, b) => b - a);
		for (const i of sorted) {
			const event = events[i];
			if (event && event.type !== 'first_payment') removeEvent(event.id);
		}
	};

	const hasAnyAvailable = availableTypes.size > 0;
	const connectorColor = withAlpha(theme.text.tertiary, 0.22);
	// Each row has a fixed height (see ROW_HEIGHT below), so the Host's
	// height is just rows × ROW_HEIGHT. SwiftUI List is lazy and won't render
	// rows outside the Host's frame, which is why we need this explicit size.
	const ROW_HEIGHT = 70;
	const listHeight = events.length * ROW_HEIGHT;

	return (
		<Root>
			<Header>
				<Title>Timeline</Title>
				{events.length > 1 && <HeaderHint>Swipe to delete</HeaderHint>}
			</Header>

			{events.length > 0 && (
				<Host style={{ alignSelf: 'stretch', height: listHeight }}>
					<List modifiers={[listStyle('insetGrouped'), scrollDisabled(true), clipShape('roundedRectangle', 16)]}>
						<Section modifiers={[listSectionMargins({ length: 0, edges: 'all' })]}>
							<List.ForEach onDelete={handleDeleteIndices}>
								{events.map((event, index) => {
									const meta = EVENT_META[event.type];
									const tone = theme.accents[meta.accent];
									const summary = eventSummary(event);
									const isFirst = index === 0;
									const isLast = index === events.length - 1;

									return (
										<HStack
											key={event.id}
											spacing={10}
											alignment="center"
											modifiers={[
												frame({ height: ROW_HEIGHT }),
												// Zero vertical row insets so adjacent cells are flush —
												// otherwise the connector line breaks at each cell border.
												listRowInsets({ top: 0, bottom: 0, leading: 16, trailing: 16 }),
												listRowSeparator('hidden'),
												deleteDisabled(event.type === 'first_payment'),
												onTapGesture(openEditor(event))
											]}
										>
											<ZStack alignment="center" modifiers={[frame({ width: 28 })]}>
												<VStack spacing={0} modifiers={[frame({ width: 2, maxHeight: 9999 })]}>
													<Rectangle
														modifiers={[
															frame({ width: 2, maxHeight: 9999 }),
															foregroundStyle(connectorColor),
															opacity(isFirst ? 0 : 1)
														]}
													/>
													<Rectangle
														modifiers={[
															frame({ width: 2, maxHeight: 9999 }),
															foregroundStyle(connectorColor),
															opacity(isLast ? 0 : 1)
														]}
													/>
												</VStack>

												<Circle modifiers={[frame({ width: 28, height: 28 }), foregroundStyle(withAlpha(tone, 0.2))]} />
												<Circle modifiers={[frame({ width: 20, height: 20 }), foregroundStyle(tone)]} />
												<Image systemName={meta.symbol} size={11} color={theme.static.white} />
											</ZStack>

											<VStack alignment="leading" spacing={4}>
												<Text modifiers={[font({ size: 15, weight: 'bold' }), foregroundStyle(tone)]}>
													{meta.label}
												</Text>

												{summary ? (
													<Text
														modifiers={[font({ size: 15, weight: 'semibold' }), foregroundStyle(theme.text.primary)]}
													>
														{summary}
													</Text>
												) : null}
											</VStack>

											<Spacer />

											<Text modifiers={[font({ size: 13, weight: 'medium' }), foregroundStyle(theme.text.tertiary)]}>
												{format(parseISO(event.date), 'MMM d, yyyy')}
											</Text>

											<Image systemName="chevron.right" size={12} color={theme.text.tertiary} />
										</HStack>
									);
								})}
							</List.ForEach>
						</Section>
					</List>
				</Host>
			)}

			{hasAnyAvailable && (
				<AddButton glassEffectStyle={glassEffectStyle}>
					<AddPressable onPress={openTypePicker} $accent={accent}>
						<SymbolView name="plus" size={15} tintColor={accent} weight="bold" />
						<AddLabel $accent={accent}>Add event</AddLabel>
					</AddPressable>
				</AddButton>
			)}

			{errors.length > 0 && (
				<ErrorBanner>
					<SymbolView
						name="exclamationmark.triangle.fill"
						size={16}
						tintColor={theme.semantic.error}
						weight="semibold"
					/>
					<ErrorTextBlock>
						{errors.map((err) => (
							<ErrorLine key={err.code}>{err.message}</ErrorLine>
						))}
					</ErrorTextBlock>
				</ErrorBanner>
			)}

			<Modal visible={pickerVisible} transparent animationType="fade" onRequestClose={closeTypePicker}>
				<TypePickerBackdrop onPress={closeTypePicker}>
					<TypePickerSheet glassEffectStyle={glassEffectStyle}>
						<TypePickerTitle>Pick event type</TypePickerTitle>

						<TypeChipGrid>
							{EVENT_ORDER.filter((type) => availableTypes.has(type)).map((type) => {
								const meta = EVENT_META[type];
								const tone = theme.accents[meta.accent];

								return (
									<TypeChipWrap key={type}>
										<TypeChip $tone={tone} onPress={handleTypeSelect(type)}>
											<SymbolView name={meta.symbol} size={14} tintColor={tone} weight="bold" />
											<TypeChipLabel $tone={tone}>{meta.label}</TypeChipLabel>
										</TypeChip>
									</TypeChipWrap>
								);
							})}
						</TypeChipGrid>
					</TypePickerSheet>
				</TypePickerBackdrop>
			</Modal>
		</Root>
	);
};

export default Timeline;
