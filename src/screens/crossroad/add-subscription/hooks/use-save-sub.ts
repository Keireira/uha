import * as Crypto from 'expo-crypto';

import db from '@db';
import { eq, inArray } from 'drizzle-orm';
import { categoriesTable, currenciesTable, servicesTable, subscriptionsTable, timelineEventsTable } from '@db/schema';

import { useGenerateTxs } from '@hooks/setup';
import {
	sortTimeline,
	isPricedEvent,
	selectTrialEvent,
	selectCancellationEvent,
	selectFirstPaymentEvent
} from '@screens/crossroad/add-subscription/events';
import { reconcileSubscription } from '@lib/notifications';

import type { ServiceT, SubscriptionT, CurrencyT } from '@models';
import type { SubscriptionDraftT, TimelineEventT } from '@screens/crossroad/add-subscription/events';

type SaveParamsT = {
	service: ServiceT;
	draft: SubscriptionDraftT;
};

type DenominatorMapT = Map<CurrencyT['id'], CurrencyT['denominator']>;
type TimelineEventInsertT = typeof timelineEventsTable.$inferInsert;
type ServiceInsertT = typeof servicesTable.$inferInsert;

const toMinorAmount = (amount: number, denominator: number): number => Math.round(amount * denominator);

const resolveDenominators = async (timeline: TimelineEventT[]): Promise<DenominatorMapT> => {
	const currencyIds = [...new Set(timeline.filter(isPricedEvent).map((event) => event.currency_id))];
	if (!currencyIds.length) {
		return new Map();
	}

	const rows = await db.select().from(currenciesTable).where(inArray(currenciesTable.id, currencyIds));
	const denominators: DenominatorMapT = new Map(rows.map((row) => [row.id, row.denominator]));
	const missingCurrencyId = currencyIds.find((id) => !denominators.has(id));

	if (missingCurrencyId) {
		throw new Error(`Missing currency denominator for ${missingCurrencyId}`);
	}

	return denominators;
};

const getDenominator = (denominators: DenominatorMapT, currencyId: CurrencyT['id']): number => {
	const denominator = denominators.get(currencyId);
	if (denominator === undefined) {
		throw new Error(`Missing currency denominator for ${currencyId}`);
	}

	return denominator;
};

const getAmount = (event: TimelineEventT): number => {
	if (isPricedEvent(event) && typeof event.amount === 'number') {
		return event.amount;
	}

	throw new Error(`Missing amount for ${event.type} event`);
};

const normalizeService = (service: ServiceT, draft: SubscriptionDraftT, categorySlug: string) => {
	const symbol = draft.logo.symbol ?? null;

	return {
		id: service.id,
		bundle_id: service.bundle_id || null,
		slug: service.slug || service.id,
		title: service.title || draft.custom_name.trim(),
		color: draft.logo.color || service.color || '#999999',
		logo_url: symbol ? null : draft.logo.image_uri || service.logo_url || null,
		symbol,
		domains: service.domains ?? [],
		social_links: service.social_links ?? {},
		aliases: service.aliases ?? [],
		category_slug: categorySlug,

		initial_emoji: service.emoji,
		initial_color: service.color,
		initial_symbol: service.symbol,
		initial_logo_url: service.logo_url
	};
};

const toTimelineRow = (
	event: TimelineEventT,
	subscriptionId: SubscriptionT['id'],
	denominators: DenominatorMapT
): TimelineEventInsertT => {
	const base = {
		id: event.id,
		subscription_id: subscriptionId,
		type: event.type,
		date: event.date
	};

	switch (event.type) {
		case 'first_payment':
		case 'price_up':
		case 'price_down':
		case 'refund':
			return {
				...base,
				amount: toMinorAmount(getAmount(event), getDenominator(denominators, event.currency_id)),
				currency_id: event.currency_id,
				duration_type: null,
				duration_value: null,
				reason: null
			};

		case 'trial':
			return {
				...base,
				amount: null,
				currency_id: null,
				duration_type: event.duration_type,
				duration_value: event.duration_value,
				reason: null
			};

		case 'pause':
		case 'cancellation':
			return {
				...base,
				amount: null,
				currency_id: null,
				duration_type: null,
				duration_value: null,
				reason: event.reason.trim() || null
			};

		case 'resume':
			return {
				...base,
				amount: null,
				currency_id: null,
				duration_type: null,
				duration_value: null,
				reason: null
			};
	}
};

const useSaveSubscriptions = () => {
	const generateSubscriptionTxs = useGenerateTxs();

	const saveSubscription = async ({ service, draft }: SaveParamsT): Promise<SubscriptionT['id']> => {
		const firstPayment = selectFirstPaymentEvent(draft.timeline);
		if (!firstPayment) {
			throw new Error('Cannot save subscription without first_payment event');
		}

		const categorySlug = draft.category_slug.trim();
		if (!categorySlug) {
			throw new Error('Cannot save subscription without category');
		}

		const [category] = await db
			.select({ slug: categoriesTable.slug })
			.from(categoriesTable)
			.where(eq(categoriesTable.slug, categorySlug));
		if (!category) {
			throw new Error(`Cannot save subscription with unknown category: ${categorySlug}`);
		}

		const trial = selectTrialEvent(draft.timeline);
		const cancellation = selectCancellationEvent(draft.timeline);
		const subscriptionId = Crypto.randomUUID();
		const denominators = await resolveDenominators(draft.timeline);
		const serviceRow = normalizeService(service, draft, categorySlug);
		const subscription: SubscriptionT = {
			id: subscriptionId,
			service_id: service.id,
			category_slug: categorySlug,
			custom_name: draft.custom_name.trim() || null,
			custom_logo: draft.logo.image_uri ?? null,
			custom_symbol: draft.logo.symbol ?? null,
			billing_cycle_type: draft.billing_cycle_type,
			billing_cycle_value: draft.billing_cycle_value,
			trial_value: trial?.duration_value ?? 1,
			trial_type: trial?.duration_type ?? 'weeks',
			first_payment_date: firstPayment.date,
			tender_id: draft.tender_id,
			cancellation_date: cancellation?.date ?? null,
			notes: draft.notes.trim() || null,
			notify_enabled: draft.notify_enabled,
			notify_days_before: draft.notify_days_before,
			notify_trial_end: draft.notify_trial_end
		};

		const timelineRows = sortTimeline(draft.timeline).map((event) =>
			toTimelineRow(event, subscriptionId, denominators)
		);

		await db.transaction(async (tx) => {
			await tx
				.insert(servicesTable)
				.values(serviceRow)
				.onConflictDoUpdate({
					target: servicesTable.id,
					set: {
						bundle_id: serviceRow.bundle_id,
						slug: serviceRow.slug,
						title: serviceRow.title,
						color: serviceRow.color,
						logo_url: serviceRow.logo_url,
						symbol: serviceRow.symbol,
						domains: serviceRow.domains,
						social_links: serviceRow.social_links,
						aliases: serviceRow.aliases,
						category_slug: serviceRow.category_slug,
						initial_emoji: serviceRow.initial_emoji,
						initial_color: serviceRow.initial_color,
						initial_symbol: serviceRow.initial_symbol,
						initial_logo_url: serviceRow.initial_logo_url
					}
				});

			await tx.insert(subscriptionsTable).values(subscription);

			if (timelineRows.length > 0) {
				await tx.insert(timelineEventsTable).values(timelineRows);
			}
		});

		await generateSubscriptionTxs(subscription);
		await reconcileSubscription(subscriptionId);

		return subscriptionId;
	};

	return saveSubscription;
};

export default useSaveSubscriptions;
