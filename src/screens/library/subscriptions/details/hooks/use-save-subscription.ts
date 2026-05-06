import { useRouter } from 'expo-router';

import db from '@db';
import { eq, inArray } from 'drizzle-orm';
import { currenciesTable, subscriptionsTable, timelineEventsTable } from '@db/schema';

import { regenerateAllTxs } from '@hooks/setup';
import { useSettingsValue } from '@hooks';
import { reconcileSubscription } from '@lib/notifications';
import {
	isPricedEvent,
	selectCancellationEvent,
	selectFirstPaymentEvent,
	selectTrialEvent,
	sortTimeline
} from '@screens/crossroad/add-subscription/events';
import { useDraftStore } from '@screens/crossroad/add-subscription/hooks';

import type { CurrencyT, ServiceT, SubscriptionT } from '@models';
import type { SubscriptionDraftT, TimelineEventT } from '@screens/crossroad/add-subscription/events';

type DenominatorMapT = Map<CurrencyT['id'], CurrencyT['denominator']>;
type TimelineEventInsertT = typeof timelineEventsTable.$inferInsert;

const toMinorAmount = (amount: number, denominator: number) => Math.round(amount * denominator);

const resolveDenominators = async (timeline: TimelineEventT[]): Promise<DenominatorMapT> => {
	const currencyIds = [...new Set(timeline.filter(isPricedEvent).map((event) => event.currency_id))];
	if (!currencyIds.length) return new Map();

	const rows = await db.select().from(currenciesTable).where(inArray(currenciesTable.id, currencyIds));
	const denominators: DenominatorMapT = new Map(rows.map((row) => [row.id, row.denominator]));
	const missing = currencyIds.find((id) => !denominators.has(id));
	if (missing) throw new Error(`Missing currency denominator for ${missing}`);
	return denominators;
};

const getDenominator = (denominators: DenominatorMapT, currencyId: CurrencyT['id']): number => {
	const denominator = denominators.get(currencyId);
	if (denominator === undefined) throw new Error(`Missing currency denominator for ${currencyId}`);
	return denominator;
};

const getAmount = (event: TimelineEventT): number => {
	if (isPricedEvent(event) && typeof event.amount === 'number') return event.amount;
	throw new Error(`Missing amount for ${event.type} event`);
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

const buildSubscriptionUpdate = (subscription: SubscriptionT, service: ServiceT, draft: SubscriptionDraftT) => {
	const firstPayment = selectFirstPaymentEvent(draft.timeline);
	if (!firstPayment) throw new Error('Cannot save subscription without first_payment event');

	const categorySlug = draft.category_slug.trim();
	if (!categorySlug) throw new Error('Cannot save subscription without category');

	const trial = selectTrialEvent(draft.timeline);
	const cancellation = selectCancellationEvent(draft.timeline);
	const customNameTrimmed = draft.custom_name.trim();

	return {
		category_slug: categorySlug,
		custom_name: customNameTrimmed && customNameTrimmed !== service.title ? customNameTrimmed : null,
		custom_logo: draft.logo.image_uri ?? null,
		custom_symbol: draft.logo.symbol ?? null,
		billing_cycle_type: draft.billing_cycle_type,
		billing_cycle_value: draft.billing_cycle_value,
		trial_type: trial?.duration_type ?? subscription.trial_type,
		trial_value: trial?.duration_value ?? subscription.trial_value,
		first_payment_date: firstPayment.date,
		tender_id: draft.tender_id,
		cancellation_date: cancellation?.date ?? null,
		notes: draft.notes.trim() || null,
		notify_enabled: draft.notify_enabled,
		notify_days_before: draft.notify_days_before,
		notify_trial_end: draft.notify_trial_end
	};
};

const useSaveSubscription = () => {
	const router = useRouter();
	const maxHorizon = useSettingsValue<number>('max_horizon');

	const saveSubscription = async (subscription: SubscriptionT, service: ServiceT) => {
		const draft = useDraftStore.getState();
		const draftSnapshot: SubscriptionDraftT = {
			logo: draft.logo,
			custom_name: draft.custom_name,
			tender_id: draft.tender_id,
			category_slug: draft.category_slug,
			billing_cycle_type: draft.billing_cycle_type,
			billing_cycle_value: draft.billing_cycle_value,
			notify_enabled: draft.notify_enabled,
			notify_days_before: draft.notify_days_before,
			notify_trial_end: draft.notify_trial_end,
			notes: draft.notes,
			timeline: draft.timeline
		};

		try {
			const update = buildSubscriptionUpdate(subscription, service, draftSnapshot);
			const denominators = await resolveDenominators(draftSnapshot.timeline);
			const timelineRows = sortTimeline(draftSnapshot.timeline).map((event) =>
				toTimelineRow(event, subscription.id, denominators)
			);

			await db.transaction(async (tx) => {
				await tx.update(subscriptionsTable).set(update).where(eq(subscriptionsTable.id, subscription.id));
				await tx.delete(timelineEventsTable).where(eq(timelineEventsTable.subscription_id, subscription.id));
				if (timelineRows.length > 0) {
					await tx.insert(timelineEventsTable).values(timelineRows);
				}
			});

			const horizonYears = typeof maxHorizon === 'number' && Number.isFinite(maxHorizon) ? maxHorizon : 2;
			await regenerateAllTxs(horizonYears);
			await reconcileSubscription(subscription.id);

			router.back();
		} catch (err) {
			console.warn('[subscription-details] save failed:', err);
		}
	};

	return saveSubscription;
};

export default useSaveSubscription;
