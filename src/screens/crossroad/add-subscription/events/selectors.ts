import { format, parseISO } from 'date-fns';
import { addByCycle, subByCycle } from '@lib/date';

import type { CurrencyT } from '@models';

import { BILLING_PRICE_EVENT_TYPES, EVENT_ORDER } from './meta';
import { isBillingPriceEvent, isCancellationEvent, isFirstPaymentEvent, isPricedEvent, isTrialEvent } from './guards';

import type {
	BillingCycleT,
	CancellationEventT,
	FirstPaymentEventT,
	ISODateStringT,
	MajorAmountT,
	PricedEventsT,
	SubscriptionDraftT,
	TimelineEventT,
	TrialEventT
} from './events.d';

export const formatISODate = (date: Date): ISODateStringT => format(date, 'yyyy-MM-dd');

export const compareEvents = (a: TimelineEventT, b: TimelineEventT): number => {
	const byDate = a.date.localeCompare(b.date);
	if (byDate !== 0) return byDate;

	return EVENT_ORDER.indexOf(a.type) - EVENT_ORDER.indexOf(b.type);
};

export const sortTimeline = (timeline: TimelineEventT[]): TimelineEventT[] => [...timeline].sort(compareEvents);

export const selectEventsByType = <T extends TimelineEventT['type']>(
	timeline: TimelineEventT[],
	type: T
): Extract<TimelineEventT, { type: T }>[] => {
	return timeline.filter((event): event is Extract<TimelineEventT, { type: T }> => event.type === type);
};

export const selectEventById = (timeline: TimelineEventT[], id: TimelineEventT['id']): TimelineEventT | undefined => {
	return timeline.find((event) => event.id === id);
};

export const selectTrialEvent = (timeline: TimelineEventT[]): TrialEventT | undefined => {
	return timeline.find(isTrialEvent);
};

export const selectFirstPaymentEvent = (timeline: TimelineEventT[]): FirstPaymentEventT | undefined => {
	return timeline.find(isFirstPaymentEvent);
};

export const selectCancellationEvent = (timeline: TimelineEventT[]): CancellationEventT | undefined => {
	return timeline.find(isCancellationEvent);
};

export const selectHasTrial = (timeline: TimelineEventT[]): boolean => {
	return selectTrialEvent(timeline) !== undefined;
};

export const selectFirstPaymentDate = (timeline: TimelineEventT[]): ISODateStringT | undefined => {
	return selectFirstPaymentEvent(timeline)?.date;
};

export const selectCancellationDate = (timeline: TimelineEventT[]): ISODateStringT | null => {
	return selectCancellationEvent(timeline)?.date ?? null;
};

export const selectTrialDuration = (
	timeline: TimelineEventT[]
): Pick<TrialEventT, 'duration_type' | 'duration_value'> | undefined => {
	const trial = selectTrialEvent(timeline);
	if (!trial) return undefined;

	return {
		duration_type: trial.duration_type,
		duration_value: trial.duration_value
	};
};

export const selectPricedEvents = (timeline: TimelineEventT[]): PricedEventsT[] => {
	return sortTimeline(timeline).filter(isPricedEvent);
};

export const selectBillingPriceEvents = (
	timeline: TimelineEventT[]
): Extract<PricedEventsT, { type: (typeof BILLING_PRICE_EVENT_TYPES)[number] }>[] => {
	return sortTimeline(timeline).filter(isBillingPriceEvent);
};

export const selectLatestPricedEvent = (
	timeline: TimelineEventT[],
	date?: ISODateStringT
): PricedEventsT | undefined => {
	return selectPricedEvents(timeline)
		.filter((event) => (date ? event.date <= date : true))
		.at(-1);
};

export const selectCurrentPriceEvent = (
	timeline: TimelineEventT[],
	date?: ISODateStringT
): Extract<PricedEventsT, { type: (typeof BILLING_PRICE_EVENT_TYPES)[number] }> | undefined => {
	return selectBillingPriceEvents(timeline)
		.filter((event) => (date ? event.date <= date : true))
		.at(-1);
};

export const selectCurrentAmount = (timeline: TimelineEventT[], date?: ISODateStringT): MajorAmountT | undefined => {
	return selectCurrentPriceEvent(timeline, date)?.amount;
};

export const selectCurrencyId = (timeline: TimelineEventT[], date?: ISODateStringT): CurrencyT['id'] | undefined => {
	return selectCurrentPriceEvent(timeline, date)?.currency_id ?? selectLatestPricedEvent(timeline, date)?.currency_id;
};

export const selectTrialEndDate = (trial: TrialEventT): ISODateStringT => {
	return formatISODate(addByCycle(parseISO(trial.date), trial.duration_type, trial.duration_value));
};

export const selectDefaultTrialStartDate = (
	firstPaymentDate: ISODateStringT,
	durationType: BillingCycleT,
	durationValue: number
): ISODateStringT => {
	return formatISODate(subByCycle(parseISO(firstPaymentDate), durationType, durationValue));
};

export const selectDraftFirstPayment = (draft: SubscriptionDraftT): FirstPaymentEventT | undefined => {
	return selectFirstPaymentEvent(draft.timeline);
};

export const selectDraftCurrencyId = (draft: SubscriptionDraftT): CurrencyT['id'] | undefined => {
	return selectCurrencyId(draft.timeline);
};

export const eventSummary = (event: TimelineEventT): string => {
	switch (event.type) {
		case 'trial':
			return `${event.duration_value} ${event.duration_type}`;

		case 'first_payment':
		case 'price_up':
		case 'price_down':
			if (event.amount === null) return '';
			return `${event.amount} ${event.currency_id}`;

		case 'refund':
			if (event.amount === null) return '';
			return `-${event.amount} ${event.currency_id}`;

		case 'pause':
		case 'cancellation':
			return event.reason.trim();

		case 'resume':
			return '';
	}
};
