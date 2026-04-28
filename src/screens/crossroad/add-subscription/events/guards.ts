import {
	PRICED_EVENT_TYPES,
	REASON_EVENT_TYPES,
	REQUIRED_EVENT_TYPES,
	SINGLETON_EVENT_TYPES,
	REMOVABLE_EVENT_TYPES,
	PRICE_CHANGE_EVENT_TYPES,
	BILLING_PRICE_EVENT_TYPES,
	TIMELINE_DIRECT_EDIT_EVENT_TYPES
} from './meta';

import type {
	EventTypeT,
	PauseEventT,
	TrialEventT,
	RefundEventT,
	ResumeEventT,
	PriceUpEventT,
	PricedEventsT,
	ReasonEventsT,
	TimelineEventT,
	PriceDownEventT,
	CancellationEventT,
	FirstPaymentEventT,
	RequiredEventTypeT,
	RemovableEventTypeT
} from './events.d';
import type { SingletonEventTypeT } from './meta';

const includesEventType = <T extends EventTypeT>(types: readonly T[], type: EventTypeT): type is T => {
	return types.includes(type as T);
};

export const hasEventType = <T extends EventTypeT>(
	event: TimelineEventT,
	type: T
): event is Extract<TimelineEventT, { type: T }> => {
	return event.type === type;
};

export const isSingletonEventType = (type: EventTypeT): type is SingletonEventTypeT => {
	return includesEventType(SINGLETON_EVENT_TYPES, type);
};

export const isSingletonEvent = (
	event: TimelineEventT
): event is Extract<TimelineEventT, { type: SingletonEventTypeT }> => {
	return isSingletonEventType(event.type);
};

export const isRequiredEventType = (type: EventTypeT): type is RequiredEventTypeT => {
	return includesEventType(REQUIRED_EVENT_TYPES, type);
};

export const isRequiredEvent = (
	event: TimelineEventT
): event is Extract<TimelineEventT, { type: RequiredEventTypeT }> => {
	return isRequiredEventType(event.type);
};

export const isRemovableEventType = (type: EventTypeT): type is RemovableEventTypeT => {
	return includesEventType(REMOVABLE_EVENT_TYPES, type);
};

export const isRemovableEvent = (
	event: TimelineEventT
): event is Extract<TimelineEventT, { type: RemovableEventTypeT }> => {
	return isRemovableEventType(event.type);
};

export const isPricedEventType = (type: EventTypeT): type is PricedEventsT['type'] => {
	return includesEventType(PRICED_EVENT_TYPES, type);
};

export const isPricedEvent = (event: TimelineEventT): event is PricedEventsT => {
	return isPricedEventType(event.type);
};

export const isBillingPriceEventType = (type: EventTypeT): type is (typeof BILLING_PRICE_EVENT_TYPES)[number] => {
	return includesEventType(BILLING_PRICE_EVENT_TYPES, type);
};

export const isBillingPriceEvent = (
	event: TimelineEventT
): event is Extract<PricedEventsT, { type: (typeof BILLING_PRICE_EVENT_TYPES)[number] }> => {
	return isBillingPriceEventType(event.type);
};

export const isPriceChangeEventType = (type: EventTypeT): type is (typeof PRICE_CHANGE_EVENT_TYPES)[number] => {
	return includesEventType(PRICE_CHANGE_EVENT_TYPES, type);
};

export const isPriceChangeEvent = (
	event: TimelineEventT
): event is Extract<PricedEventsT, { type: (typeof PRICE_CHANGE_EVENT_TYPES)[number] }> => {
	return isPriceChangeEventType(event.type);
};

export const isReasonEventType = (type: EventTypeT): type is ReasonEventsT['type'] => {
	return includesEventType(REASON_EVENT_TYPES, type);
};

export const isReasonEvent = (event: TimelineEventT): event is ReasonEventsT => {
	return isReasonEventType(event.type);
};

export const isTimelineDirectEditEventType = (
	type: EventTypeT
): type is (typeof TIMELINE_DIRECT_EDIT_EVENT_TYPES)[number] => {
	return includesEventType(TIMELINE_DIRECT_EDIT_EVENT_TYPES, type);
};

export const isTimelineDirectEditEvent = (
	event: TimelineEventT
): event is Extract<TimelineEventT, { type: (typeof TIMELINE_DIRECT_EDIT_EVENT_TYPES)[number] }> => {
	return isTimelineDirectEditEventType(event.type);
};

export const isTrialEvent = (event: TimelineEventT): event is TrialEventT => {
	return hasEventType(event, 'trial');
};

export const isFirstPaymentEvent = (event: TimelineEventT): event is FirstPaymentEventT => {
	return hasEventType(event, 'first_payment');
};

export const isPriceUpEvent = (event: TimelineEventT): event is PriceUpEventT => {
	return hasEventType(event, 'price_up');
};

export const isPriceDownEvent = (event: TimelineEventT): event is PriceDownEventT => {
	return hasEventType(event, 'price_down');
};

export const isPauseEvent = (event: TimelineEventT): event is PauseEventT => {
	return hasEventType(event, 'pause');
};

export const isResumeEvent = (event: TimelineEventT): event is ResumeEventT => {
	return hasEventType(event, 'resume');
};

export const isRefundEvent = (event: TimelineEventT): event is RefundEventT => {
	return hasEventType(event, 'refund');
};

export const isCancellationEvent = (event: TimelineEventT): event is CancellationEventT => {
	return hasEventType(event, 'cancellation');
};
