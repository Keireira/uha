import { create } from 'zustand';
import {
	format,
	parseISO,
	addDays,
	addWeeks,
	addMonths,
	addYears,
	subDays,
	subWeeks,
	subMonths,
	subYears
} from 'date-fns';
import * as Crypto from 'expo-crypto';

import type { ServiceT } from '@models';
import { EVENT_ORDER } from '../events';
import type { TimelineEventT, TrialEventT, FirstPaymentEventT } from '../events';

export type BillingCycleT = 'days' | 'weeks' | 'months' | 'years';

// Distribute Omit / Partial over the TimelineEventT union so each variant keeps its
// own shape, rather than TS collapsing to just the common keys.
type DistributiveOmit<T, K extends PropertyKey> = T extends unknown ? Omit<T, K> : never;
type DistributivePartial<T> = T extends unknown ? Partial<T> : never;

export type NewTimelineEventT = DistributiveOmit<TimelineEventT, 'id'>;
export type TimelineEventPatchT = DistributivePartial<TimelineEventT>;

type SubscriptionDraftT = ServiceT & {
	symbol?: string;

	price?: number;
	currency?: string;

	first_payment_date: string;
	billing_cycle_type: BillingCycleT;
	billing_cycle_value: number;

	tender_id: string | null;
	with_trial: boolean;
	trial_duration_type: BillingCycleT;
	trial_duration_value: number;

	notes: string;

	notify_enabled: boolean;
	notify_days_before: number[];

	timeline: TimelineEventT[];
};

type LogoSnapshotT = {
	logo_url: string | null;
	symbol?: string;
	color: string;
};

export type SubscriptionStoreT = SubscriptionDraftT & {
	logoSnapshot: LogoSnapshotT;
	actions: ActionsT;
};

type ActionsT = {
	init: (data: Partial<SubscriptionDraftT>) => void;
	patch: (data: Partial<SubscriptionDraftT>) => void;

	setTitle: (title: string) => void;
	setSlug: (slug: string) => void;
	setColor: (color: string) => void;
	setLogoUrl: (logo_url: string) => void;
	setSymbol: (symbol?: string) => void;

	setPrice: (price: number) => void;
	setCurrency: (currency: string) => void;

	setFirstPaymentDate: (date: string) => void;
	setBillingCycle: (type: BillingCycleT, value: number) => void;
	setWithTrial: (enabled: boolean) => void;
	setTrialDuration: (type: BillingCycleT, value: number) => void;
	setCategorySlug: (slug: string) => void;
	setTenderId: (id: string | null) => void;

	setNotes: (notes: string) => void;
	setNotifyEnabled: (enabled: boolean) => void;
	setNotifyDaysBefore: (days: number[]) => void;

	addEvent: (event: NewTimelineEventT) => string;
	updateEvent: (id: string, patch: TimelineEventPatchT) => void;
	removeEvent: (id: string) => void;

	/** Align first_payment_date with the current trial: first_payment = trial.date + duration. */
	syncFirstPaymentToTrial: () => void;

	/** Repair every structural issue flagged by `timelineErrors` in one shot. */
	autoFixTimeline: () => void;

	resetLogo: () => void;
	reset: () => void;
};

const today = () => format(new Date(), 'yyyy-MM-dd');

const initialDraft: SubscriptionDraftT = {
	title: '',
	color: '',
	logo_url: '',
	slug: '',
	id: '',
	bundle_id: '',
	ref_link: '',
	domains: [],
	social_links: {},
	aliases: [],
	category_slug: '',
	symbol: undefined,

	price: undefined,
	currency: undefined,

	first_payment_date: today(),
	billing_cycle_type: 'months',
	billing_cycle_value: 1,

	tender_id: null,
	with_trial: false,
	trial_duration_type: 'days',
	trial_duration_value: 7,

	notes: '',

	notify_enabled: false,
	notify_days_before: [1],

	timeline: []
};

export const addByCycle = (base: Date, type: BillingCycleT, value: number) => {
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

export const subByCycle = (base: Date, type: BillingCycleT, value: number) => {
	switch (type) {
		case 'days':
			return subDays(base, value);
		case 'weeks':
			return subWeeks(base, value);
		case 'months':
			return subMonths(base, value);
		case 'years':
			return subYears(base, value);
	}
};

const initialSnapshot: LogoSnapshotT = {
	logo_url: '',
	symbol: undefined,
	color: ''
};

/* ─── Timeline helpers ───────────────────────────────────── */

const sortTimeline = (events: TimelineEventT[]) =>
	[...events].sort((a, b) => {
		const byDate = a.date.localeCompare(b.date);
		if (byDate !== 0) return byDate;
		// Same day: fall back to canonical order (trial → first_payment → …).
		return EVENT_ORDER.indexOf(a.type) - EVENT_ORDER.indexOf(b.type);
	});

/** Compute the first-payment date that should follow a trial event. */
const firstPaymentAfterTrial = (trial: Pick<TrialEventT, 'date' | 'duration_type' | 'duration_value'>) =>
	format(
		addByCycle(parseISO(trial.date), trial.duration_type, trial.duration_value),
		'yyyy-MM-dd'
	);

const findTrial = (events: TimelineEventT[]): TrialEventT | undefined =>
	events.find((e): e is TrialEventT => e.type === 'trial');

const findFirstPayment = (events: TimelineEventT[]): FirstPaymentEventT | undefined =>
	events.find((e): e is FirstPaymentEventT => e.type === 'first_payment');

const replaceOrAppend = <E extends TimelineEventT>(
	events: TimelineEventT[],
	predicate: (e: TimelineEventT) => boolean,
	next: E
): TimelineEventT[] => {
	const exists = events.some(predicate);
	if (exists) {
		return events.map((e) => (predicate(e) ? next : e));
	}
	return [...events, next];
};

const useDraftStore = create<SubscriptionStoreT>((set) => ({
	...initialDraft,
	logoSnapshot: initialSnapshot,

	actions: {
		init: (data) => {
			const draft = { ...initialDraft, ...data };

			let timeline = draft.timeline;

			// Ensure first_payment event exists — the billing-start anchor.
			if (!timeline.some((e) => e.type === 'first_payment')) {
				const fp: FirstPaymentEventT = {
					id: Crypto.randomUUID(),
					type: 'first_payment',
					date: draft.first_payment_date,
					amount: draft.price ?? 0,
					currency: draft.currency ?? 'USD'
				};
				timeline = sortTimeline([...timeline, fp]);
			}

			// Ensure trial event exists when with_trial is on. Trial date defaults to
			// first_payment_date minus trial_duration, so the trial ends exactly on
			// first_payment_date (the user can still override afterwards).
			if (draft.with_trial && !timeline.some((e) => e.type === 'trial')) {
				const trialStart = format(
					subByCycle(parseISO(draft.first_payment_date), draft.trial_duration_type, draft.trial_duration_value),
					'yyyy-MM-dd'
				);
				const tr: TrialEventT = {
					id: Crypto.randomUUID(),
					type: 'trial',
					date: trialStart,
					duration_type: draft.trial_duration_type,
					duration_value: draft.trial_duration_value
				};
				timeline = sortTimeline([...timeline, tr]);
			}

			set({
				...draft,
				timeline,
				logoSnapshot: {
					logo_url: draft.logo_url,
					symbol: draft.symbol,
					color: draft.color
				}
			});
		},

		patch: (data) => set({ ...data }),

		setTitle: (title) => set({ title }),
		setSlug: (slug) => set({ slug }),
		setColor: (color) => set({ color }),
		setLogoUrl: (logo_url) => set({ logo_url }),
		setSymbol: (symbol) => set({ symbol }),

		/* ─── Price / currency: sync first_payment event ────────── */
		setPrice: (price) =>
			set((state) => {
				const patch: Partial<SubscriptionDraftT> = { price };

				const fp = findFirstPayment(state.timeline);
				if (fp) {
					patch.timeline = state.timeline.map((e) =>
						e.id === fp.id ? { ...fp, amount: price } : e
					);
				} else if (price > 0) {
					// First time price is set — materialize a first_payment event.
					const ev: FirstPaymentEventT = {
						id: Crypto.randomUUID(),
						type: 'first_payment',
						date: state.first_payment_date,
						amount: price,
						currency: state.currency ?? 'USD'
					};
					patch.timeline = sortTimeline([...state.timeline, ev]);
				}

				return patch;
			}),

		setCurrency: (currency) =>
			set((state) => {
				const patch: Partial<SubscriptionDraftT> = { currency };

				// Propagate currency change to any priced events in the timeline.
				const next = state.timeline.map((e) =>
					e.type === 'first_payment' ||
					e.type === 'price_up' ||
					e.type === 'price_down' ||
					e.type === 'refund'
						? { ...e, currency }
						: e
				);
				patch.timeline = next;

				return patch;
			}),

		/* ─── First payment date: sync event (materialize if missing) ─── */
		setFirstPaymentDate: (first_payment_date) =>
			set((state) => {
				const patch: Partial<SubscriptionDraftT> = { first_payment_date };

				const fp = findFirstPayment(state.timeline);
				if (fp) {
					patch.timeline = sortTimeline(
						state.timeline.map((e) => (e.id === fp.id ? { ...fp, date: first_payment_date } : e))
					);
				} else {
					const ev: FirstPaymentEventT = {
						id: Crypto.randomUUID(),
						type: 'first_payment',
						date: first_payment_date,
						amount: state.price ?? 0,
						currency: state.currency ?? 'USD'
					};
					patch.timeline = sortTimeline([...state.timeline, ev]);
				}

				return patch;
			}),

		setBillingCycle: (billing_cycle_type, billing_cycle_value) =>
			set({ billing_cycle_type, billing_cycle_value }),

		/* ─── Trial toggle: materialize / remove trial event ────── */
		setWithTrial: (with_trial) =>
			set((state) => {
				const patch: Partial<SubscriptionDraftT> = { with_trial };

				if (with_trial) {
					const existing = findTrial(state.timeline);
					if (!existing) {
						// Default trial so it ends exactly on first_payment_date
						// (no overlap → no validation error out of the gate).
						const trialStart = format(
							subByCycle(
								parseISO(state.first_payment_date),
								state.trial_duration_type,
								state.trial_duration_value
							),
							'yyyy-MM-dd'
						);
						const ev: TrialEventT = {
							id: Crypto.randomUUID(),
							type: 'trial',
							date: trialStart,
							duration_type: state.trial_duration_type,
							duration_value: state.trial_duration_value
						};
						patch.timeline = sortTimeline([...state.timeline, ev]);
					}
				} else {
					patch.timeline = state.timeline.filter((e) => e.type !== 'trial');
				}

				return patch;
			}),

		/* ─── Trial duration: sync trial event only (no auto-bump of first_payment) ── */
		setTrialDuration: (trial_duration_type, trial_duration_value) =>
			set((state) => {
				const patch: Partial<SubscriptionDraftT> = {
					trial_duration_type,
					trial_duration_value
				};

				const existing = findTrial(state.timeline);
				if (existing) {
					patch.timeline = state.timeline.map((e) =>
						e.id === existing.id
							? { ...existing, duration_type: trial_duration_type, duration_value: trial_duration_value }
							: e
					);
				}

				return patch;
			}),

		setCategorySlug: (category_slug) => set({ category_slug }),
		setTenderId: (tender_id) => set({ tender_id }),

		setNotes: (notes) => set({ notes }),
		setNotifyEnabled: (notify_enabled) => set({ notify_enabled }),
		setNotifyDaysBefore: (notify_days_before) => set({ notify_days_before }),

		/* ─── Timeline CRUD: sync back to root fields ──────────── */
		addEvent: (event) => {
			const id = Crypto.randomUUID();
			set((state) => {
				const newEvent = { id, ...event } as TimelineEventT;
				const nextTimeline = sortTimeline(
					replaceOrAppend(
						state.timeline,
						// If an event of same "singleton" type already exists, replace it.
						newEvent.type === 'trial' ||
							newEvent.type === 'first_payment' ||
							newEvent.type === 'cancellation'
							? (e) => e.type === newEvent.type
							: () => false,
						newEvent
					)
				);

				const patch: Partial<SubscriptionDraftT> = { timeline: nextTimeline };

				if (newEvent.type === 'trial') {
					patch.with_trial = true;
					patch.trial_duration_type = newEvent.duration_type;
					patch.trial_duration_value = newEvent.duration_value;
				}

				if (newEvent.type === 'first_payment') {
					patch.first_payment_date = newEvent.date;
					patch.price = newEvent.amount;
					patch.currency = newEvent.currency;
				}

				return patch;
			});
			return id;
		},

		updateEvent: (id, eventPatch) => {
			set((state) => {
				let updated: TimelineEventT | undefined;

				const nextTimeline = sortTimeline(
					state.timeline.map((event) => {
						if (event.id !== id) return event;
						const next = { ...event, ...eventPatch } as TimelineEventT;
						updated = next;
						return next;
					})
				);

				const patch: Partial<SubscriptionDraftT> = { timeline: nextTimeline };

				if (updated?.type === 'trial') {
					patch.trial_duration_type = updated.duration_type;
					patch.trial_duration_value = updated.duration_value;
				}

				if (updated?.type === 'first_payment') {
					patch.first_payment_date = updated.date;
					patch.price = updated.amount;
					patch.currency = updated.currency;
				}

				return patch;
			});
		},

		syncFirstPaymentToTrial: () =>
			set((state) => {
				const trial = findTrial(state.timeline);
				if (!trial) return state;

				const fpDate = firstPaymentAfterTrial(trial);
				const nextTimeline = sortTimeline(
					state.timeline.map((e) =>
						e.type === 'first_payment' ? { ...e, date: fpDate } : e
					)
				);

				return { first_payment_date: fpDate, timeline: nextTimeline };
			}),

		/*
		 * One-shot repair. Each step corresponds to a `timelineErrors` code:
		 *
		 *  1. trial_overlaps_first_payment → push first_payment forward to trial
		 *     end (trusting the user's explicit trial configuration).
		 *  2. event_before_first_payment / cancellation_before_first_payment →
		 *     clamp every non-trial, non-first_payment event that pre-dates billing
		 *     up to first_payment.date.
		 *  3. resume_without_pause → drop dangling resume events (they have no
		 *     pause to match).
		 */
		autoFixTimeline: () =>
			set((state) => {
				let timeline = sortTimeline(state.timeline);

				const trial = findTrial(timeline);
				const fp = findFirstPayment(timeline);

				let fpDate = fp?.date ?? state.first_payment_date;

				// 1. Align first_payment with the trial if the trial would overlap it.
				if (trial && fp) {
					const expectedFp = firstPaymentAfterTrial(trial);
					if (expectedFp > fp.date) {
						fpDate = expectedFp;
						timeline = timeline.map((e) =>
							e.id === fp.id ? { ...e, date: expectedFp } : e
						) as TimelineEventT[];
					}
				}

				// 2. Clamp any event that still pre-dates first_payment.
				if (fp) {
					timeline = timeline.map((e) => {
						if (e.type === 'trial' || e.type === 'first_payment') return e;
						if (e.date < fpDate) return { ...e, date: fpDate };
						return e;
					}) as TimelineEventT[];
				}

				// 3. Drop resume events without a preceding unbalanced pause.
				const dropIds = new Set<string>();
				let balance = 0;
				for (const e of sortTimeline(timeline)) {
					if (e.type === 'pause') balance++;
					else if (e.type === 'resume') {
						if (balance <= 0) {
							dropIds.add(e.id);
						} else {
							balance--;
						}
					}
				}
				if (dropIds.size > 0) {
					timeline = timeline.filter((e) => !dropIds.has(e.id));
				}

				return {
					first_payment_date: fpDate,
					timeline: sortTimeline(timeline)
				};
			}),

		removeEvent: (id) => {
			set((state) => {
				const removed = state.timeline.find((e) => e.id === id);
				const nextTimeline = state.timeline.filter((event) => event.id !== id);

				const patch: Partial<SubscriptionDraftT> = { timeline: nextTimeline };

				if (removed?.type === 'trial') {
					patch.with_trial = false;
				}

				return patch;
			});
		},

		resetLogo: () => {
			set((state) => ({
				logo_url: state.logoSnapshot.logo_url,
				symbol: state.logoSnapshot.symbol,
				color: state.logoSnapshot.color
			}));
		},

		reset: () => {
			set({
				...initialDraft,
				logoSnapshot: initialSnapshot
			});
		}
	}
}));

export default useDraftStore;
