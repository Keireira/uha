import type { AccentT } from '@themes';
import type { SFSymbol } from 'expo-symbols';
import type { ServiceT, SubscriptionT, CurrencyT, CategoryT, TenderT } from '@models';

/* TypeScript trick for preserving discriminated union shapes. */
type DistributiveOmit<T, K extends PropertyKey> = T extends unknown ? Omit<T, K> : never;
type DistributivePartialOmit<T, K extends PropertyKey> = T extends unknown ? Partial<Omit<T, K>> : never;

export type MajorAmountT = number | null;
export type ISODateStringT = string;
export type BillingCycleT = SubscriptionT['billing_cycle_type'];

/* Events */
export type EventTypeT =
	| 'trial'
	| 'first_payment'
	| 'price_up'
	| 'price_down'
	| 'pause'
	| 'resume'
	| 'refund'
	| 'cancellation';

export type RequiredEventTypeT = 'first_payment';
export type RemovableEventTypeT = Exclude<EventTypeT, RequiredEventTypeT>;

type EventBaseT = {
	id: string;
	date: ISODateStringT; // YYYY-MM-DD
};

export type FirstPaymentEventT = EventBaseT & {
	type: 'first_payment';
	amount: MajorAmountT; // In major units. Empty draft value is null; convert to minor on save.
	currency_id: CurrencyT['id']; // USD
};

export type TrialEventT = EventBaseT & {
	type: 'trial';
	duration_type: BillingCycleT;
	duration_value: number;
};

export type PriceUpEventT = EventBaseT & {
	type: 'price_up';
	amount: MajorAmountT; // In major units. Empty draft value is null; convert to minor on save.
	currency_id: CurrencyT['id']; // USD
};

export type PriceDownEventT = EventBaseT & {
	type: 'price_down';
	amount: MajorAmountT; // In major units. Empty draft value is null; convert to minor on save.
	currency_id: CurrencyT['id']; // USD
};

export type PauseEventT = EventBaseT & {
	type: 'pause';
	reason: string; // may be an empty string
};

export type ResumeEventT = EventBaseT & {
	type: 'resume';
};

export type RefundEventT = EventBaseT & {
	type: 'refund';
	amount: MajorAmountT; // In major units. Empty draft value is null; convert to minor on save.
	currency_id: CurrencyT['id']; // USD
};

export type CancellationEventT = EventBaseT & {
	type: 'cancellation';
	reason: string; // may be an empty string
};

export type TimelineEventT =
	| FirstPaymentEventT
	| TrialEventT
	| PriceUpEventT
	| PriceDownEventT
	| PauseEventT
	| ResumeEventT
	| RefundEventT
	| CancellationEventT;

export type PricedEventsT = FirstPaymentEventT | PriceUpEventT | PriceDownEventT | RefundEventT;
export type ReasonEventsT = PauseEventT | CancellationEventT;

export type NewTimelineEventT = DistributiveOmit<TimelineEventT, 'id'>;
export type PatchTimelineEventT = DistributivePartialOmit<TimelineEventT, 'id' | 'type'>;

/* Metadata */
export type EventMetaT = {
	label: string;
	symbol: SFSymbol;
	accent: AccentT;
	description: string;
};

export type EventMetaMapT = Record<EventTypeT, EventMetaT>;

/* Store */
export type LogoDraftT = {
	image_uri?: string; // Remote URL string | file URL (asset.uri)
	symbol?: SFSymbol;
	// emoji?: string;
	color?: string;
};

/* Выбранный ServiceT используется при init, из него заполняется logo/custom_name/category_slug,
 * а сам draft дальше хранит только то, что пользователь может переопределить для подписки.
 **/
export type SubscriptionDraftT = {
	logo: LogoDraftT;
	custom_name: string;

	tender_id: TenderT['id'] | null;
	category_slug: CategoryT['slug'];

	billing_cycle_value: number;
	billing_cycle_type: BillingCycleT;

	notify_enabled: boolean;
	notify_days_before: number;
	notify_trial_end: boolean;

	notes: string; // may be an empty string

	timeline: TimelineEventT[];
};

export type SubscriptionDraftInitT = {
	currency_id: CurrencyT['id'];
	first_payment_date?: ISODateStringT;
	amount?: MajorAmountT;
	billing_cycle_type?: BillingCycleT;
	billing_cycle_value?: number;
	draft?: Partial<SubscriptionDraftT>;
};

export type SubscriptionDraftActionsT = {
	init: (service: ServiceT, params: SubscriptionDraftInitT) => void;
	patch: (draft: Partial<SubscriptionDraftT>) => void;
	reset: () => void;

	setLogoSymbol: (symbol: LogoDraftT['symbol']) => void;
	setLogoImage: (image_uri: LogoDraftT['image_uri']) => void;
	setSubscriptionColor: (color: LogoDraftT['color']) => void;
	resetLogo: () => void;

	setSubscriptionTitle: (name: string) => void;
	setTenderId: (id: TenderT['id'] | null) => void;
	setCategorySlug: (slug: CategoryT['slug']) => void;
	setBillingCycle: (type: BillingCycleT, value: number) => void;
	setNotifyEnabled: (enabled: boolean) => void;
	setNotifyDaysBefore: (days: number) => void;
	setNotifyTrialEnd: (enabled: boolean) => void;
	setNotes: (notes: string) => void;

	setFirstPaymentDate: (date: ISODateStringT) => void;
	setFirstPaymentAmount: (amount: MajorAmountT) => void;
	setCurrencyId: (currency_id: CurrencyT['id']) => void;

	enableTrial: () => void;
	disableTrial: () => void;
	setTrialDuration: (type: BillingCycleT, value: number) => void;
	syncFirstPaymentToTrial: () => void;

	addEvent: (event: NewTimelineEventT) => TimelineEventT['id'];
	updateEvent: (id: TimelineEventT['id'], patch: PatchTimelineEventT) => void;
	removeEvent: (id: TimelineEventT['id']) => void;
	autoFixTimeline: () => void;
};

export type SubscriptionDraftStoreT = SubscriptionDraftT & {
	logoSnapshot: LogoDraftT;
	default_currency_id: CurrencyT['id'];
	actions: SubscriptionDraftActionsT;
};

export type DraftToSaveT = {
	service_id: ServiceT['id'];
	category_slug: CategoryT['slug'];
	custom_name: string | null;
	custom_symbol: LogoDraftT['symbol'] | null;
	custom_logo: LogoDraftT['image_uri'] | null;
	billing_cycle_type: SubscriptionT['billing_cycle_type'];
	billing_cycle_value: SubscriptionT['billing_cycle_value'];
	trial_type: TrialEventT['duration_type'];
	trial_value: TrialEventT['duration_value'];
	first_payment_date: FirstPaymentEventT['date'];
	tender_id: TenderT['id'] | null;
	cancellation_date: CancellationEventT['date'] | null;
	notify_enabled: SubscriptionT['notify_enabled'];
	notify_days_before: SubscriptionT['notify_days_before'];
	notify_trial_end: SubscriptionT['notify_trial_end'];
	notes: SubscriptionT['notes'];
};
