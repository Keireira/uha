import type { SFSymbol } from 'expo-symbols';
import type { AccentT } from '@themes';

import type { BillingCycleT } from './hooks/use-draft-store';

/* ─── Event types ───────────────────────────────────────────── */

export type EventTypeT =
	| 'trial'
	| 'first_payment'
	| 'price_up'
	| 'price_down'
	| 'pause'
	| 'resume'
	| 'refund'
	| 'cancellation';

type EventBaseT = {
	id: string;
	date: string; // YYYY-MM-DD
};

export type TrialEventT = EventBaseT & {
	type: 'trial';
	duration_type: BillingCycleT;
	duration_value: number;
};

export type FirstPaymentEventT = EventBaseT & {
	type: 'first_payment';
	amount: number;
	currency: string;
};

export type PriceUpEventT = EventBaseT & {
	type: 'price_up';
	amount: number;
	currency: string;
};

export type PriceDownEventT = EventBaseT & {
	type: 'price_down';
	amount: number;
	currency: string;
};

export type RefundEventT = EventBaseT & {
	type: 'refund';
	amount: number;
	currency: string;
};

export type PauseEventT = EventBaseT & {
	type: 'pause';
	reason: string | null;
};

export type ResumeEventT = EventBaseT & {
	type: 'resume';
};

export type CancellationEventT = EventBaseT & {
	type: 'cancellation';
	reason: string | null;
};

export type TimelineEventT =
	| TrialEventT
	| FirstPaymentEventT
	| PriceUpEventT
	| PriceDownEventT
	| RefundEventT
	| PauseEventT
	| ResumeEventT
	| CancellationEventT;

export type PricedEventT = FirstPaymentEventT | PriceUpEventT | PriceDownEventT | RefundEventT;

/* ─── Display metadata ─────────────────────────────────────── */

type EventMetaT = {
	label: string;
	symbol: SFSymbol;
	accent: AccentT;
	description: string;
};

export const EVENT_META: Record<EventTypeT, EventMetaT> = {
	trial: {
		label: 'Trial',
		symbol: 'gift.fill',
		accent: 'indigo',
		description: 'Free trial period'
	},
	first_payment: {
		label: 'First Payment',
		symbol: 'flag.fill',
		accent: 'blue',
		description: 'Billing starts'
	},
	price_up: {
		label: 'Price Up',
		symbol: 'arrow.up.right',
		accent: 'orange',
		description: 'Price went up'
	},
	price_down: {
		label: 'Price Down',
		symbol: 'arrow.down.right',
		accent: 'mint',
		description: 'Price went down'
	},
	pause: {
		label: 'Pause',
		symbol: 'pause.fill',
		accent: 'yellow',
		description: 'Subscription paused'
	},
	resume: {
		label: 'Resume',
		symbol: 'play.fill',
		accent: 'green',
		description: 'Subscription resumed'
	},
	refund: {
		label: 'Refund',
		symbol: 'arrow.uturn.backward',
		accent: 'red',
		description: 'Money returned'
	},
	cancellation: {
		label: 'Cancellation',
		symbol: 'xmark.circle.fill',
		accent: 'red',
		description: 'Subscription stopped'
	}
};

export const EVENT_ORDER: EventTypeT[] = [
	'trial',
	'first_payment',
	'price_up',
	'price_down',
	'pause',
	'resume',
	'refund',
	'cancellation'
];

/* ─── Type guards ──────────────────────────────────────────── */

export const isPricedEvent = (event: TimelineEventT): event is PricedEventT =>
	event.type === 'first_payment' ||
	event.type === 'price_up' ||
	event.type === 'price_down' ||
	event.type === 'refund';

export const isTrialEvent = (event: TimelineEventT): event is TrialEventT => event.type === 'trial';

export const isPauseEvent = (event: TimelineEventT): event is PauseEventT => event.type === 'pause';

export const isCancellationEvent = (event: TimelineEventT): event is CancellationEventT =>
	event.type === 'cancellation';

/* ─── Validity ─────────────────────────────────────────────── */

const countByType = (timeline: TimelineEventT[], type: EventTypeT, excludeId?: string) =>
	timeline.filter((e) => e.type === type && e.id !== excludeId).length;

export const isTimelinePaused = (timeline: TimelineEventT[], excludeId?: string): boolean => {
	const pauses = countByType(timeline, 'pause', excludeId);
	const resumes = countByType(timeline, 'resume', excludeId);
	return pauses > resumes;
};

/**
 * Returns the set of event types that can currently be added (or changed to,
 * when `excludeId` is the id of the event being edited).
 *
 * Rules:
 *  - trial / first_payment / cancellation: at most one
 *  - pause: only if not currently paused
 *  - resume: only if currently paused (requires a dangling pause)
 */
export const availableEventTypes = (
	timeline: TimelineEventT[],
	excludeId?: string
): Set<EventTypeT> => {
	const hasTrial = countByType(timeline, 'trial', excludeId) > 0;
	const hasFirstPayment = countByType(timeline, 'first_payment', excludeId) > 0;
	const hasCancellation = countByType(timeline, 'cancellation', excludeId) > 0;
	const paused = isTimelinePaused(timeline, excludeId);

	const allowed = new Set<EventTypeT>();

	for (const type of EVENT_ORDER) {
		if (type === 'trial' && hasTrial) continue;
		if (type === 'first_payment' && hasFirstPayment) continue;
		if (type === 'cancellation' && hasCancellation) continue;
		if (type === 'pause' && paused) continue;
		if (type === 'resume' && !paused) continue;
		allowed.add(type);
	}

	return allowed;
};

/* ─── Summaries ────────────────────────────────────────────── */

const unitLabel = (type: BillingCycleT, value: number) => {
	switch (type) {
		case 'days':
			return value === 1 ? 'day' : 'days';
		case 'weeks':
			return value === 1 ? 'week' : 'weeks';
		case 'months':
			return value === 1 ? 'month' : 'months';
		case 'years':
			return value === 1 ? 'year' : 'years';
	}
};

export const eventSummary = (event: TimelineEventT): string => {
	if (isTrialEvent(event)) {
		return `${event.duration_value} ${unitLabel(event.duration_type, event.duration_value)}`;
	}

	if (isPricedEvent(event)) {
		if (event.amount <= 0) return '';
		return `${event.amount.toFixed(2)} ${event.currency}`;
	}

	if (isPauseEvent(event) || isCancellationEvent(event)) {
		return event.reason ?? '';
	}

	return '';
};

/* ─── Validation ───────────────────────────────────────────── */

import { addDays, addWeeks, addMonths, addYears, parseISO } from 'date-fns';

const addCycle = (base: Date, type: BillingCycleT, value: number) => {
	switch (type) {
		case 'days':
			return addDays(base, value);
		case 'weeks':
			return addWeeks(base, value);
		case 'months':
			return addMonths(base, value);
		case 'years':
			return addYears(base, value);
	}
};

export type TimelineErrorT = {
	code:
		| 'trial_overlaps_first_payment'
		| 'resume_without_pause'
		| 'cancellation_before_first_payment'
		| 'event_before_first_payment';
	message: string;
};

/**
 * Checks structural invariants the store cannot guarantee on its own (dates are
 * user-controlled). Returns an empty array when everything is sane.
 */
export const timelineErrors = (timeline: TimelineEventT[]): TimelineErrorT[] => {
	const errors: TimelineErrorT[] = [];

	const trial = timeline.find((e): e is TrialEventT => e.type === 'trial');
	const firstPayment = timeline.find(
		(e): e is FirstPaymentEventT => e.type === 'first_payment'
	);

	// Trial must end on or before first_payment.date.
	if (trial && firstPayment) {
		const trialEnd = addCycle(
			parseISO(trial.date),
			trial.duration_type,
			trial.duration_value
		);
		const fpStart = parseISO(firstPayment.date);
		if (trialEnd > fpStart) {
			errors.push({
				code: 'trial_overlaps_first_payment',
				message: 'Trial must end on or before the first payment date.'
			});
		}
	}

	// Resume must be preceded by an unmatched pause.
	let balance = 0;
	const ordered = [...timeline].sort((a, b) => a.date.localeCompare(b.date));
	for (const e of ordered) {
		if (e.type === 'pause') balance++;
		else if (e.type === 'resume') {
			if (balance <= 0) {
				errors.push({
					code: 'resume_without_pause',
					message: 'Each resume must follow an active pause.'
				});
				break;
			}
			balance--;
		}
	}

	// Cancellation can't be before the first payment.
	const cancellation = timeline.find(
		(e): e is CancellationEventT => e.type === 'cancellation'
	);
	if (cancellation && firstPayment && cancellation.date < firstPayment.date) {
		errors.push({
			code: 'cancellation_before_first_payment',
			message: 'Cancellation cannot happen before the first payment.'
		});
	}

	// Other events (price changes / pause / resume / refund) shouldn't pre-date
	// the first payment either.
	if (firstPayment) {
		const preBillingEvent = timeline.find(
			(e) =>
				e.type !== 'trial' &&
				e.type !== 'first_payment' &&
				e.date < firstPayment.date
		);
		if (preBillingEvent) {
			errors.push({
				code: 'event_before_first_payment',
				message: 'Price changes and status events must happen on or after the first payment.'
			});
		}
	}

	return errors;
};

/* ─── Misc ─────────────────────────────────────────────────── */

export const MIN_EVENT_DATE = new Date('2010-01-01T00:00:00');
