import { create } from 'zustand';
import * as Crypto from 'expo-crypto';

import {
	autoFixTimeline as autoFixDraftTimeline,
	createSubscriptionDraft,
	disableTrial,
	enableTrial,
	formatISODate,
	patchDraft,
	removeEvent,
	selectCurrencyId,
	setBillingCycle,
	setCurrencyId,
	setFirstPaymentAmount,
	setFirstPaymentDate,
	setLogoImage,
	setLogoSymbol,
	setSubscriptionColor,
	setSubscriptionTitle,
	setTrialDuration,
	syncFirstPaymentToTrial,
	addEvent as addDraftEvent,
	updateEvent as updateDraftEvent
} from '../events';

import type {
	LogoDraftT,
	MajorAmountT,
	BillingCycleT,
	TimelineEventT,
	NewTimelineEventT,
	SubscriptionDraftT,
	PatchTimelineEventT,
	SubscriptionDraftInitT,
	SubscriptionDraftStoreT
} from '../events';
import type { CategoryT, CurrencyT, ServiceT, TenderT } from '@models';

export { PERIOD_LIMITS } from '../events';

const EMPTY_LOGO: LogoDraftT = {};

const createId = (): TimelineEventT['id'] => Crypto.randomUUID();

const createEmptyDraft = (): SubscriptionDraftT => ({
	logo: EMPTY_LOGO,
	custom_name: '',
	tender_id: null,
	category_slug: '',
	billing_cycle_type: 'months',
	billing_cycle_value: 1,
	notify_enabled: false,
	notify_days_before: 1,
	notify_trial_end: false,
	notes: '',
	timeline: []
});

const INITIAL_DRAFT = createEmptyDraft();
const INITIAL_CURRENCY_ID = 'USD' as CurrencyT['id'];

const resetState = () => ({
	...INITIAL_DRAFT,
	logoSnapshot: EMPTY_LOGO,
	default_currency_id: INITIAL_CURRENCY_ID
});

const useDraftStore = create<SubscriptionDraftStoreT>((set) => ({
	...resetState(),

	actions: {
		init: (service: ServiceT, params: SubscriptionDraftInitT) => {
			const draft = createSubscriptionDraft(service, {
				idFactory: createId,
				currency_id: params.currency_id,
				first_payment_date: params.first_payment_date,
				amount: params.amount,
				billing_cycle_type: params.billing_cycle_type,
				billing_cycle_value: params.billing_cycle_value
			});
			const nextDraft = params.draft ? patchDraft(draft, params.draft) : draft;

			set({
				...nextDraft,
				logoSnapshot: nextDraft.logo,
				default_currency_id: params.currency_id
			});
		},

		patch: (draft: Partial<SubscriptionDraftT>) => set((state) => patchDraft(state, draft)),
		reset: () => set(resetState()),

		setLogoSymbol: (symbol: LogoDraftT['symbol']) => {
			set((state) => setLogoSymbol(state, symbol));
		},
		setLogoImage: (image_uri: LogoDraftT['image_uri']) => {
			set((state) => setLogoImage(state, image_uri));
		},
		setSubscriptionColor: (color: LogoDraftT['color']) => {
			set((state) => setSubscriptionColor(state, color));
		},
		resetLogo: () => {
			set((state) => ({ logo: state.logoSnapshot }));
		},

		setSubscriptionTitle: (name: string) => set((state) => setSubscriptionTitle(state, name)),
		setTenderId: (id: TenderT['id'] | null) => set({ tender_id: id }),
		setCategorySlug: (slug: CategoryT['slug']) => set({ category_slug: slug }),
		setBillingCycle: (type: BillingCycleT, value: number) => set((state) => setBillingCycle(state, type, value)),
		setNotifyEnabled: (enabled: boolean) => set({ notify_enabled: enabled }),
		setNotifyDaysBefore: (days: number) => set({ notify_days_before: days }),
		setNotifyTrialEnd: (enabled: boolean) => set({ notify_trial_end: enabled }),
		setNotes: (notes: string) => set({ notes }),

		setFirstPaymentDate: (date: string) => set((state) => setFirstPaymentDate(state, date)),
		setFirstPaymentAmount: (amount: MajorAmountT) => set((state) => setFirstPaymentAmount(state, amount)),
		setCurrencyId: (currency_id: CurrencyT['id']) => set((state) => setCurrencyId(state, currency_id)),

		enableTrial: () => set((state) => enableTrial(state, { idFactory: createId })),
		disableTrial: () => set((state) => disableTrial(state)),
		setTrialDuration: (type: BillingCycleT, value: number) => set((state) => setTrialDuration(state, type, value)),
		syncFirstPaymentToTrial: () => set((state) => syncFirstPaymentToTrial(state)),

		addEvent: (event: NewTimelineEventT) => {
			const id = createId();
			set((state) => addDraftEvent(state, event, id));
			return id;
		},
		updateEvent: (id: TimelineEventT['id'], patch: PatchTimelineEventT) =>
			set((state) => updateDraftEvent(state, id, patch)),
		removeEvent: (id: TimelineEventT['id']) => set((state) => removeEvent(state, id)),
		autoFixTimeline: () =>
			set((state) =>
				autoFixDraftTimeline(state, {
					firstPayment: {
						idFactory: createId,
						date: formatISODate(new Date()),
						currency_id: selectCurrencyId(state.timeline) ?? state.default_currency_id,
						amount: 0
					}
				})
			)
	}
}));

export default useDraftStore;
