import React, { useCallback, useRef, useState } from 'react';
import { Modal } from 'react-native';
import { format, parseISO } from 'date-fns';
import { useRouter } from 'expo-router';
import { useTheme } from 'styled-components/native';
import { SymbolView } from 'expo-symbols';
import { useShallow } from 'zustand/react/shallow';
import ReanimatedSwipeable, { type SwipeableMethods } from 'react-native-gesture-handler/ReanimatedSwipeable';
import * as Haptics from 'expo-haptics';

import { useAccent } from '@hooks';
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
	Card,
	SwipeWrap,
	EventRow,
	Rail,
	Connector,
	NodeBubble,
	NodeCore,
	EventBody,
	EventLabel,
	EventDate,
	EventSummary,
	EventMeta,
	Chevron,
	DeleteAction,
	DeleteActionLabel,
	AddButton,
	AddPressable,
	AddLabel,
	EmptyState,
	EmptyText,
	EmptyHint,
	TypePickerBackdrop,
	TypePickerSheet,
	TypePickerTitle,
	TypeChipGrid,
	TypeChipWrap,
	TypeChip,
	TypeChipLabel
} from './timeline.styles';

type EventItemProps = {
	event: TimelineEventT;
	isFirst: boolean;
	isLast: boolean;
	onPress: () => void;
	onDelete: () => void;
};

const EventItem = ({ event, isFirst, isLast, onPress, onDelete }: EventItemProps) => {
	const theme = useTheme();
	const swipeRef = useRef<SwipeableMethods>(null);
	const [isOpen, setIsOpen] = useState(false);

	const meta = EVENT_META[event.type];
	const tone = theme.accents[meta.accent];
	const summary = eventSummary(event);

	const handleDelete = () => {
		Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
		onDelete();
	};

	const handlePress = () => {
		// If the swipeable is open (or was just opened by this tap), don't navigate —
		// close it instead, matching iOS Mail / Messages behavior.
		if (isOpen) {
			swipeRef.current?.close();
			return;
		}
		onPress();
	};

	const renderRightActions = useCallback(
		() => (
			<DeleteAction onPress={handleDelete}>
				<SymbolView name="trash.fill" size={20} tintColor={theme.static.white} />
				<DeleteActionLabel>Delete</DeleteActionLabel>
			</DeleteAction>
		),
		// eslint-disable-next-line react-hooks/exhaustive-deps
		[theme]
	);

	return (
		<SwipeWrap>
			<ReanimatedSwipeable
				ref={swipeRef}
				friction={2}
				rightThreshold={40}
				overshootRight={false}
				renderRightActions={renderRightActions}
				onSwipeableWillOpen={() => setIsOpen(true)}
				onSwipeableWillClose={() => setIsOpen(false)}
			>
				<EventRow onPress={handlePress}>
					<Rail>
						<Connector $above={!isFirst} $below={!isLast} />
						<NodeBubble $tone={tone}>
							<NodeCore $tone={tone}>
								<SymbolView name={meta.symbol} size={11} tintColor={theme.static.white} weight="bold" />
							</NodeCore>
						</NodeBubble>
					</Rail>

					<EventBody>
						<EventLabel $tone={tone}>{meta.label}</EventLabel>
						{summary ? <EventSummary>{summary}</EventSummary> : null}
					</EventBody>

					<EventMeta>
						<EventDate>{format(parseISO(event.date), 'MMM d, yyyy')}</EventDate>
						<Chevron>
							<SymbolView name="chevron.right" size={12} tintColor={theme.text.tertiary} />
						</Chevron>
					</EventMeta>
				</EventRow>
			</ReanimatedSwipeable>
		</SwipeWrap>
	);
};

const Timeline = () => {
	const router = useRouter();
	const theme = useTheme();
	const accent = useAccent();

	const glassEffectStyle = !theme.is_oled && theme.tint === 'dark' ? 'regular' : 'clear';

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
			router.push({
				pathname: '/(pickers)/trial-duration',
				params: { from: 'timeline' }
			});
			return;
		}
		if (event.type === 'first_payment') {
			router.push({
				pathname: '/(crossroad)/first-payment-date',
				params: {
					from: 'timeline'
				}
			});
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
				pathname: '/(pickers)/trial-duration',
				params: { from: 'timeline' }
			});
			return;
		}

		router.push({
			pathname: '/(pickers)/edit-event',
			params: { type }
		});
	};

	const handleDelete = (id: string) => () => {
		removeEvent(id);
	};

	const hasEvents = events.length > 0;
	const hasAnyAvailable = availableTypes.size > 0;

	return (
		<Root>
			<Header>
				<Title>Timeline</Title>
				{hasEvents && <HeaderHint>Swipe to delete</HeaderHint>}
			</Header>

			{hasEvents && (
				<Card glassEffectStyle={glassEffectStyle}>
					{events.map((event, index) => (
						<EventItem
							key={event.id}
							event={event}
							isFirst={index === 0}
							isLast={index === events.length - 1}
							onPress={openEditor(event)}
							onDelete={handleDelete(event.id)}
						/>
					))}
				</Card>
			)}

			{!hasEvents && (
				<Card glassEffectStyle={glassEffectStyle}>
					<EmptyState>
						<SymbolView name="point.3.connected.trianglepath.dotted" size={32} tintColor={theme.text.tertiary} />
						<EmptyText>No events yet</EmptyText>
						<EmptyHint>Track the subscription lifecycle</EmptyHint>
					</EmptyState>
				</Card>
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
