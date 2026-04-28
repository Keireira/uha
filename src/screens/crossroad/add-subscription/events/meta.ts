import type {
	EventTypeT,
	EventMetaMapT,
	PricedEventsT,
	ReasonEventsT,
	RequiredEventTypeT,
	RemovableEventTypeT
} from './events.d';

export const EVENT_META = {
	trial: {
		label: 'Trial',
		description: 'Free trial period',
		symbol: 'gift.fill',
		accent: 'indigo'
	},
	first_payment: {
		label: 'First Payment',
		description: 'Billing starts',
		symbol: 'flag.fill',
		accent: 'blue'
	},
	price_up: {
		label: 'Price Up',
		description: 'Price went up',
		symbol: 'arrow.up.right',
		accent: 'orange'
	},
	price_down: {
		label: 'Price Down',
		description: 'Price went down',
		symbol: 'arrow.down.right',
		accent: 'mint'
	},
	pause: {
		label: 'Pause',
		description: 'Subscription paused',
		symbol: 'pause.fill',
		accent: 'yellow'
	},
	resume: {
		label: 'Resume',
		description: 'Subscription resumed',
		symbol: 'play.fill',
		accent: 'green'
	},
	refund: {
		label: 'Refund',
		description: 'Money returned',
		symbol: 'arrow.uturn.backward',
		accent: 'red'
	},
	cancellation: {
		label: 'Cancellation',
		description: 'Subscription stopped',
		symbol: 'xmark.circle.fill',
		accent: 'red'
	}
} satisfies EventMetaMapT;

export const EVENT_ORDER = [
	'trial',
	'first_payment',
	'price_up',
	'price_down',
	'pause',
	'resume',
	'refund',
	'cancellation'
] as const satisfies readonly EventTypeT[];

export const SINGLETON_EVENT_TYPES = [
	'trial',
	'first_payment',
	'cancellation'
] as const satisfies readonly EventTypeT[];

export type SingletonEventTypeT = (typeof SINGLETON_EVENT_TYPES)[number];

export const REQUIRED_EVENT_TYPES = ['first_payment'] as const satisfies readonly RequiredEventTypeT[];

export const REMOVABLE_EVENT_TYPES = [
	'trial',
	'price_up',
	'price_down',
	'pause',
	'resume',
	'refund',
	'cancellation'
] as const satisfies readonly RemovableEventTypeT[];

export const PRICED_EVENT_TYPES = [
	'first_payment',
	'price_up',
	'price_down',
	'refund'
] as const satisfies readonly PricedEventsT['type'][];

export const BILLING_PRICE_EVENT_TYPES = [
	'first_payment',
	'price_up',
	'price_down'
] as const satisfies readonly PricedEventsT['type'][];

export const PRICE_CHANGE_EVENT_TYPES = ['price_up', 'price_down'] as const satisfies readonly PricedEventsT['type'][];

export const REASON_EVENT_TYPES = ['pause', 'cancellation'] as const satisfies readonly ReasonEventsT['type'][];

export const EVENT_AMOUNT_LABELS = {
	first_payment: 'Amount',
	price_up: 'New price',
	price_down: 'New price',
	refund: 'Refunded'
} satisfies Record<PricedEventsT['type'], string>;

export const EVENT_REASON_PLACEHOLDERS = {
	pause: 'Why did you pause?',
	cancellation: 'Why did you cancel?'
} satisfies Record<ReasonEventsT['type'], string>;

export const TIMELINE_DIRECT_EDIT_EVENT_TYPES = ['trial', 'first_payment'] as const satisfies readonly EventTypeT[];
