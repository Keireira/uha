import { EVENT_ORDER, SINGLETON_EVENT_TYPES } from './meta';
import {
	isBillingPriceEvent,
	isCancellationEvent,
	isFirstPaymentEvent,
	isPauseEvent,
	isResumeEvent,
	isSingletonEventType,
	isTrialEvent
} from './guards';
import {
	selectCurrentPriceEvent,
	selectDefaultTrialStartDate,
	selectFirstPaymentEvent,
	sortTimeline
} from './selectors';

import type { EventTypeT, ISODateStringT, TimelineEventT } from './events.d';

export type TimelineIssueCodeT =
	| 'missing_first_payment'
	| 'duplicate_singleton_event'
	| 'trial_date_not_synced'
	| 'resume_without_pause'
	| 'cancellation_before_first_payment'
	| 'event_before_first_payment';

export type TimelineIssueFixT =
	| 'create_first_payment'
	| 'remove_duplicate'
	| 'sync_trial_to_first_payment'
	| 'remove_dangling_resume'
	| 'move_event_to_first_payment';

export type TimelineIssueT = {
	code: TimelineIssueCodeT;
	message: string;
	fix: TimelineIssueFixT;
	needsInput?: boolean;
	eventType?: EventTypeT;
	eventId?: TimelineEventT['id'];
	relatedEventId?: TimelineEventT['id'];
};

export type PriceChangeWarningCodeT = 'price_up_not_higher' | 'price_down_not_lower';

export type PriceChangeWarningT = {
	code: PriceChangeWarningCodeT;
	message: string;
	priorAmount: number;
};

export const countEventsByType = (
	timeline: TimelineEventT[],
	type: EventTypeT,
	excludeId?: TimelineEventT['id']
): number => {
	return timeline.filter((event) => event.type === type && event.id !== excludeId).length;
};

export const hasTimelineEventType = (
	timeline: TimelineEventT[],
	type: EventTypeT,
	excludeId?: TimelineEventT['id']
): boolean => {
	return countEventsByType(timeline, type, excludeId) > 0;
};

export const isTimelinePaused = (timeline: TimelineEventT[], excludeId?: TimelineEventT['id']): boolean => {
	let balance = 0;

	for (const event of sortTimeline(timeline).filter((item) => item.id !== excludeId)) {
		if (isPauseEvent(event)) {
			balance++;
		} else if (isResumeEvent(event) && balance > 0) {
			balance--;
		}
	}

	return balance > 0;
};

export const canAddEventType = (
	timeline: TimelineEventT[],
	type: EventTypeT,
	excludeId?: TimelineEventT['id']
): boolean => {
	if (isSingletonEventType(type) && hasTimelineEventType(timeline, type, excludeId)) {
		return false;
	}

	const paused = isTimelinePaused(timeline, excludeId);
	if (type === 'pause') return !paused;
	if (type === 'resume') return paused;

	return true;
};

export const availableEventTypes = (timeline: TimelineEventT[], excludeId?: TimelineEventT['id']): Set<EventTypeT> => {
	return new Set(EVENT_ORDER.filter((type) => canAddEventType(timeline, type, excludeId)));
};

export const canRemoveEvent = (event: TimelineEventT): boolean => {
	return !isFirstPaymentEvent(event);
};

export const findDanglingResumeIds = (timeline: TimelineEventT[]): Set<TimelineEventT['id']> => {
	const ids = new Set<TimelineEventT['id']>();
	let balance = 0;

	for (const event of sortTimeline(timeline)) {
		if (isPauseEvent(event)) {
			balance++;
		} else if (isResumeEvent(event)) {
			if (balance <= 0) {
				ids.add(event.id);
			} else {
				balance--;
			}
		}
	}

	return ids;
};

export const findDuplicateSingletonIds = (timeline: TimelineEventT[]): Set<TimelineEventT['id']> => {
	const ids = new Set<TimelineEventT['id']>();

	for (const type of SINGLETON_EVENT_TYPES) {
		const events = sortTimeline(timeline.filter((event) => event.type === type));

		for (const event of events.slice(1)) {
			ids.add(event.id);
		}
	}

	return ids;
};

export const timelineIssues = (timeline: TimelineEventT[]): TimelineIssueT[] => {
	const issues: TimelineIssueT[] = [];
	const sortedTimeline = sortTimeline(timeline);
	const firstPayment = selectFirstPaymentEvent(sortedTimeline);

	if (!firstPayment) {
		issues.push({
			code: 'missing_first_payment',
			message: 'Timeline must include a first payment event.',
			fix: 'create_first_payment',
			needsInput: true,
			eventType: 'first_payment'
		});
	}

	for (const type of SINGLETON_EVENT_TYPES) {
		const duplicates = sortTimeline(sortedTimeline.filter((event) => event.type === type)).slice(1);
		for (const event of duplicates) {
			issues.push({
				code: 'duplicate_singleton_event',
				message: 'Timeline contains duplicate singleton events.',
				fix: 'remove_duplicate',
				eventType: event.type,
				eventId: event.id
			});
		}
	}

	const trial = sortedTimeline.find(isTrialEvent);
	if (
		trial &&
		firstPayment &&
		trial.date !== selectDefaultTrialStartDate(firstPayment.date, trial.duration_type, trial.duration_value)
	) {
		issues.push({
			code: 'trial_date_not_synced',
			message: 'Trial start date must match the first payment date and trial duration.',
			fix: 'sync_trial_to_first_payment',
			eventType: trial.type,
			eventId: trial.id,
			relatedEventId: firstPayment.id
		});
	}

	const danglingResumeIds = findDanglingResumeIds(sortedTimeline);
	for (const id of danglingResumeIds) {
		issues.push({
			code: 'resume_without_pause',
			message: 'Each resume must follow an active pause.',
			fix: 'remove_dangling_resume',
			eventType: 'resume',
			eventId: id
		});
	}

	const cancellation = sortedTimeline.find(isCancellationEvent);
	if (cancellation && firstPayment && cancellation.date < firstPayment.date) {
		issues.push({
			code: 'cancellation_before_first_payment',
			message: 'Cancellation cannot happen before the first payment.',
			fix: 'move_event_to_first_payment',
			eventType: cancellation.type,
			eventId: cancellation.id,
			relatedEventId: firstPayment.id
		});
	}

	if (firstPayment) {
		const preBillingEvents = sortedTimeline.filter((event) => {
			if (isTrialEvent(event) || isFirstPaymentEvent(event) || isCancellationEvent(event)) return false;
			return event.date < firstPayment.date;
		});

		for (const event of preBillingEvents) {
			issues.push({
				code: 'event_before_first_payment',
				message: 'Non-trial events must happen on or after the first payment.',
				fix: 'move_event_to_first_payment',
				eventType: event.type,
				eventId: event.id,
				relatedEventId: firstPayment.id
			});
		}
	}

	return issues;
};

export const timelineErrors = timelineIssues;

export const hasTimelineIssues = (timeline: TimelineEventT[]): boolean => {
	return timelineIssues(timeline).length > 0;
};

export const hasTimelineIssuesRequiringInput = (timeline: TimelineEventT[]): boolean => {
	return timelineIssues(timeline).some((issue) => issue.needsInput === true);
};

export const getPriceChangeWarning = (
	timeline: TimelineEventT[],
	type: 'price_up' | 'price_down',
	amount: number,
	date: ISODateStringT,
	excludeId?: TimelineEventT['id']
): PriceChangeWarningT | undefined => {
	const prior = selectCurrentPriceEvent(
		timeline.filter((event) => event.id !== excludeId),
		date
	);

	if (!(prior && typeof prior.amount === 'number')) return undefined;

	if (type === 'price_up' && amount <= prior.amount) {
		return {
			code: 'price_up_not_higher',
			message: 'New price should be higher than the previous price.',
			priorAmount: prior.amount
		};
	}

	if (type === 'price_down' && amount >= prior.amount) {
		return {
			code: 'price_down_not_lower',
			message: 'New price should be lower than the previous price.',
			priorAmount: prior.amount
		};
	}

	return undefined;
};

export const canGenerateBilling = (timeline: TimelineEventT[]): boolean => {
	return timeline.some(isBillingPriceEvent) && timelineIssues(timeline).length === 0;
};
