import {
	formatISODate,
	selectDefaultTrialStartDate,
	selectFirstPaymentEvent,
	selectTrialEndDate,
	selectTrialEvent,
	sortTimeline
} from './selectors';
import { canRemoveEvent, findDanglingResumeIds, findDuplicateSingletonIds } from './rules';
import { isFirstPaymentEvent, isPricedEvent, isSingletonEvent, isTrialEvent } from './guards';

import type { CurrencyT, ServiceT } from '@models';
import type {
	BillingCycleT,
	FirstPaymentEventT,
	ISODateStringT,
	LogoDraftT,
	MajorAmountT,
	NewTimelineEventT,
	PatchTimelineEventT,
	SubscriptionDraftT,
	TimelineEventT,
	TrialEventT
} from './events.d';

export type IdFactoryT = () => TimelineEventT['id'];

export type DraftInitT = {
	idFactory: IdFactoryT;
	currency_id: CurrencyT['id'];
	first_payment_date?: ISODateStringT;
	amount?: MajorAmountT;
	billing_cycle_type?: BillingCycleT;
	billing_cycle_value?: number;
};

export type EnableTrialParamsT = {
	idFactory: IdFactoryT;
	duration_type?: BillingCycleT;
	duration_value?: number;
};

export type EnsureFirstPaymentParamsT = {
	idFactory: IdFactoryT;
	date: ISODateStringT;
	currency_id: CurrencyT['id'];
	amount?: MajorAmountT;
};

export type AutoFixTimelineParamsT = {
	firstPayment?: EnsureFirstPaymentParamsT;
};

const today = (): ISODateStringT => formatISODate(new Date());

const toTimelineEvent = (event: NewTimelineEventT, id: TimelineEventT['id']): TimelineEventT => {
	return { id, ...event } as TimelineEventT;
};

export const createFirstPaymentEvent = ({
	idFactory,
	date,
	currency_id,
	amount = null
}: EnsureFirstPaymentParamsT): FirstPaymentEventT => {
	return {
		id: idFactory(),
		type: 'first_payment',
		date,
		amount,
		currency_id
	};
};

export const createSubscriptionDraft = (
	service: ServiceT,
	{
		idFactory,
		currency_id,
		first_payment_date = today(),
		amount = null,
		billing_cycle_type = 'months',
		billing_cycle_value = 1
	}: DraftInitT
): SubscriptionDraftT => {
	const symbol = (service.symbol ?? undefined) as LogoDraftT['symbol'];

	return {
		logo: {
			image_uri: symbol ? undefined : (service.logo_url ?? undefined),
			symbol,
			color: service.color
		},
		custom_name: service.title,
		tender_id: null,
		category_slug: service.category_slug,
		billing_cycle_type,
		billing_cycle_value,
		notify_enabled: false,
		notify_days_before: [1],
		notes: '',
		timeline: [
			createFirstPaymentEvent({
				idFactory,
				date: first_payment_date,
				amount,
				currency_id
			})
		]
	};
};

export const patchDraft = (draft: SubscriptionDraftT, patch: Partial<SubscriptionDraftT>): SubscriptionDraftT => {
	return {
		...draft,
		...patch
	};
};

export const setLogoSymbol = (
	draft: SubscriptionDraftT,
	symbol: SubscriptionDraftT['logo']['symbol']
): SubscriptionDraftT => ({
	...draft,
	logo: {
		...draft.logo,
		image_uri: undefined,
		symbol
	}
});

export const setLogoImage = (
	draft: SubscriptionDraftT,
	image_uri: SubscriptionDraftT['logo']['image_uri']
): SubscriptionDraftT => ({
	...draft,
	logo: {
		...draft.logo,
		image_uri,
		symbol: undefined
	}
});

export const setSubscriptionColor = (
	draft: SubscriptionDraftT,
	color: SubscriptionDraftT['logo']['color']
): SubscriptionDraftT => {
	return {
		...draft,
		logo: {
			...draft.logo,
			color
		}
	};
};

export const setSubscriptionTitle = (draft: SubscriptionDraftT, custom_name: string): SubscriptionDraftT => {
	return {
		...draft,
		custom_name
	};
};

export const setBillingCycle = (
	draft: SubscriptionDraftT,
	billing_cycle_type: BillingCycleT,
	billing_cycle_value: number
): SubscriptionDraftT => {
	return {
		...draft,
		billing_cycle_type,
		billing_cycle_value
	};
};

export const addEventToTimeline = (timeline: TimelineEventT[], event: TimelineEventT): TimelineEventT[] => {
	if (isSingletonEvent(event)) {
		const withoutExisting = timeline.filter((item) => item.type !== event.type);
		return sortTimeline([...withoutExisting, event]);
	}

	return sortTimeline([...timeline, event]);
};

export const addEvent = (
	draft: SubscriptionDraftT,
	event: NewTimelineEventT,
	id: TimelineEventT['id']
): SubscriptionDraftT => {
	return {
		...draft,
		timeline: addEventToTimeline(draft.timeline, toTimelineEvent(event, id))
	};
};

export const updateEvent = (
	draft: SubscriptionDraftT,
	id: TimelineEventT['id'],
	patch: PatchTimelineEventT
): SubscriptionDraftT => {
	let changed = false;
	const timeline = draft.timeline.map((event) => {
		if (event.id !== id) return event;
		changed = true;
		return { ...event, ...patch } as TimelineEventT;
	});

	if (!changed) return draft;

	return {
		...draft,
		timeline: sortTimeline(timeline)
	};
};

export const removeEvent = (draft: SubscriptionDraftT, id: TimelineEventT['id']): SubscriptionDraftT => {
	const event = draft.timeline.find((item) => item.id === id);
	if (!(event && canRemoveEvent(event))) return draft;

	return {
		...draft,
		timeline: draft.timeline.filter((item) => item.id !== id)
	};
};

export const ensureFirstPayment = (
	draft: SubscriptionDraftT,
	params: EnsureFirstPaymentParamsT
): SubscriptionDraftT => {
	if (selectFirstPaymentEvent(draft.timeline)) return draft;

	return {
		...draft,
		timeline: addEventToTimeline(draft.timeline, createFirstPaymentEvent(params))
	};
};

export const setFirstPaymentDate = (draft: SubscriptionDraftT, date: ISODateStringT): SubscriptionDraftT => {
	const firstPayment = selectFirstPaymentEvent(draft.timeline);
	if (!firstPayment) return draft;

	return {
		...draft,
		timeline: sortTimeline(
			draft.timeline.map((event) => {
				if (isFirstPaymentEvent(event)) {
					return { ...event, date };
				}

				if (isTrialEvent(event)) {
					return {
						...event,
						date: selectDefaultTrialStartDate(date, event.duration_type, event.duration_value)
					};
				}

				return event;
			})
		)
	};
};

export const setFirstPaymentAmount = (draft: SubscriptionDraftT, amount: MajorAmountT): SubscriptionDraftT => {
	const firstPayment = selectFirstPaymentEvent(draft.timeline);
	if (!firstPayment) return draft;

	return updateEvent(draft, firstPayment.id, { amount });
};

export const setCurrencyId = (draft: SubscriptionDraftT, currency_id: CurrencyT['id']): SubscriptionDraftT => {
	return {
		...draft,
		timeline: draft.timeline.map((event) => (isPricedEvent(event) ? { ...event, currency_id } : event))
	};
};

export const enableTrial = (
	draft: SubscriptionDraftT,
	{ idFactory, duration_type = 'days', duration_value = 7 }: EnableTrialParamsT
): SubscriptionDraftT => {
	if (selectTrialEvent(draft.timeline)) return draft;

	const firstPayment = selectFirstPaymentEvent(draft.timeline);
	const date = firstPayment ? selectDefaultTrialStartDate(firstPayment.date, duration_type, duration_value) : today();

	const trial: TrialEventT = {
		id: idFactory(),
		type: 'trial',
		date,
		duration_type,
		duration_value
	};

	return {
		...draft,
		timeline: addEventToTimeline(draft.timeline, trial)
	};
};

export const disableTrial = (draft: SubscriptionDraftT): SubscriptionDraftT => {
	return {
		...draft,
		timeline: draft.timeline.filter((event) => !isTrialEvent(event))
	};
};

export const setTrialDuration = (
	draft: SubscriptionDraftT,
	duration_type: BillingCycleT,
	duration_value: number
): SubscriptionDraftT => {
	const trial = selectTrialEvent(draft.timeline);
	if (!trial) return draft;
	const firstPayment = selectFirstPaymentEvent(draft.timeline);

	return updateEvent(draft, trial.id, {
		date: firstPayment ? selectDefaultTrialStartDate(firstPayment.date, duration_type, duration_value) : trial.date,
		duration_type,
		duration_value
	});
};

export const syncFirstPaymentToTrial = (draft: SubscriptionDraftT): SubscriptionDraftT => {
	const trial = selectTrialEvent(draft.timeline);
	if (!trial) return draft;

	return setFirstPaymentDate(draft, selectTrialEndDate(trial));
};

export const autoFixTimeline = (draft: SubscriptionDraftT, params: AutoFixTimelineParamsT = {}): SubscriptionDraftT => {
	let timeline = sortTimeline(draft.timeline);

	if (!selectFirstPaymentEvent(timeline) && params.firstPayment) {
		timeline = addEventToTimeline(timeline, createFirstPaymentEvent(params.firstPayment));
	}

	const duplicateSingletonIds = findDuplicateSingletonIds(timeline);
	if (duplicateSingletonIds.size > 0) {
		timeline = timeline.filter((event) => !duplicateSingletonIds.has(event.id));
	}

	const firstPayment = selectFirstPaymentEvent(timeline);
	const trial = selectTrialEvent(timeline);
	let firstPaymentDate = firstPayment?.date;

	if (firstPayment && trial) {
		const trialStartDate = selectDefaultTrialStartDate(firstPayment.date, trial.duration_type, trial.duration_value);
		timeline = timeline.map((event) => (isTrialEvent(event) ? { ...event, date: trialStartDate } : event));
	}

	if (firstPaymentDate) {
		timeline = timeline.map((event) => {
			if (isTrialEvent(event) || isFirstPaymentEvent(event)) return event;
			if (event.date < firstPaymentDate) return { ...event, date: firstPaymentDate };
			return event;
		});
	}

	const danglingResumeIds = findDanglingResumeIds(timeline);
	if (danglingResumeIds.size > 0) {
		timeline = timeline.filter((event) => !danglingResumeIds.has(event.id));
	}

	return {
		...draft,
		timeline: sortTimeline(timeline)
	};
};
