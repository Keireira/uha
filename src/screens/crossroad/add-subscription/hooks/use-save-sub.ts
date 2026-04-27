import * as Crypto from 'expo-crypto';
import { useRouter } from 'expo-router';
import { useGenerateTxs } from '@hooks/setup';

import db from '@db';
import { eq } from 'drizzle-orm';
import { subscriptionsTable, timelineEventsTable, servicesTable } from '@db/schema';

import type { SubscriptionT } from '@models';
import type { TimelineEventT } from '../events';

/**
 * Minimal service shape needed to upsert a row into `servicesTable`. Kept
 * shallow on purpose so the call site can pass the draft spread (which is
 * `ServiceT & {...}`) without extra plumbing.
 */
type ServiceInput = {
	id: string;
	title: string;
	color: string;
	slug: string | null;
	logo_url: string | null;
	bundle_id: string | null;
	ref_link: string | null;
	domains: string[];
	social_links: Record<string, string>;
	aliases: string[];
};

type SaveParams = {
	/** Full service snapshot — will be persisted before the subscription insert. */
	service: ServiceInput;
	category_slug: string;
	custom_name: string | null;
	custom_emoji: string | null;
	billing_cycle_type: SubscriptionT['billing_cycle_type'];
	billing_cycle_value: number;
	/** Resolved currency id (DB row id) — used for every priced / refund event. */
	currencyId: string;
	/** e.g. 100 for USD, 1 for JPY; used to scale decimal amounts to minor units. */
	denominator: number;
	firstPaymentDate: string;
	tenderId: string | null;
	notes: string | null;
	notifyEnabled: boolean;
	notifyDaysBefore: number[];
	timeline: TimelineEventT[];
};

type TimelineEventRow = typeof timelineEventsTable.$inferInsert;

const toMinor = (amount: number, denominator: number) => Math.round(amount * denominator);

/**
 * Flatten a client-side timeline event (discriminated union) into the
 * superset row shape of `timeline_events`. Columns that don't apply to the
 * event type are set to null.
 */
const toTimelineRow = (
	event: TimelineEventT,
	subscriptionId: string,
	currencyId: string,
	denominator: number
): TimelineEventRow => {
	const base: TimelineEventRow = {
		id: event.id,
		subscription_id: subscriptionId,
		type: event.type,
		date: event.date,
		amount: null,
		currency_id: null,
		duration_type: null,
		duration_value: null,
		reason: null
	};

	switch (event.type) {
		case 'first_payment':
		case 'price_up':
		case 'price_down':
		case 'refund':
			return {
				...base,
				amount: toMinor(event.amount, denominator),
				currency_id: currencyId
			};
		case 'trial':
			return {
				...base,
				duration_type: event.duration_type,
				duration_value: event.duration_value
			};
		case 'pause':
		case 'cancellation':
			return { ...base, reason: event.reason };
		case 'resume':
			return base;
	}
};

const useSaveSubscriptions = () => {
	const router = useRouter();
	const generateSubscriptionTxs = useGenerateTxs();

	// 1. Ensure the referenced service row exists (tx query innerJoins services).
	// 2. Save subscription (cancellation_date denormalized from timeline for convenience).
	// 3. Save the full timeline (every event type — not just prices).
	// 4. Generate scheduled billing txs + standalone refund txs via the generator,
	//    which reads the timeline back from the DB (single source of truth).
	// 5. Go back.
	const save = async (params: SaveParams) => {
		const subscriptionId = Crypto.randomUUID();

		const cancellationEvent = params.timeline.find((e) => e.type === 'cancellation');
		const cancellationDate = cancellationEvent?.date ?? null;

		const subscription: SubscriptionT = {
			id: subscriptionId,
			service_id: params.service.id,
			category_slug: params.category_slug,
			custom_name: params.custom_name,
			custom_emoji: params.custom_emoji,
			billing_cycle_type: params.billing_cycle_type,
			billing_cycle_value: params.billing_cycle_value,
			first_payment_date: params.firstPaymentDate,
			tender_id: params.tenderId,
			cancellation_date: cancellationDate,
			notes: params.notes,
			notify_enabled: params.notifyEnabled,
			notify_days_before: JSON.stringify(params.notifyDaysBefore)
		};

		// Ensure the referenced service row exists. `useLoadService` resolves the
		// service in memory only — without this step, the tx query's
		// `innerJoin(servicesTable, ...)` drops every generated transaction and
		// the subscription silently disappears from lists/calendar.
		const [existingService] = await db
			.select({ id: servicesTable.id })
			.from(servicesTable)
			.where(eq(servicesTable.id, params.service.id));

		if (!existingService) {
			await db.insert(servicesTable).values({
				id: params.service.id,
				title: params.service.title,
				color: params.service.color || '#888888',
				slug: params.service.slug,
				logo_url: params.service.logo_url,
				bundle_id: params.service.bundle_id,
				ref_link: params.service.ref_link,
				domains: params.service.domains ?? [],
				social_links: params.service.social_links ?? {},
				aliases: params.service.aliases ?? [],
				// services.category_slug is NOT NULL + FK to categories.slug — reuse
				// the category the user picked for the subscription (validated by the
				// picker against the live categories list).
				category_slug: params.category_slug
			});
		}

		// Insert subscription FIRST — timeline_events.subscription_id references it.
		await db.insert(subscriptionsTable).values(subscription);

		// Persist the full timeline. If the draft somehow lacks a first_payment event
		// (shouldn't happen — validation + init guarantee it), synthesize one so the
		// generator can still anchor billing.
		const timelineRows: TimelineEventRow[] = params.timeline.map((e) =>
			toTimelineRow(e, subscriptionId, params.currencyId, params.denominator)
		);

		const hasFirstPayment = timelineRows.some((r) => r.type === 'first_payment');
		if (!hasFirstPayment) {
			timelineRows.push({
				id: Crypto.randomUUID(),
				subscription_id: subscriptionId,
				type: 'first_payment',
				date: params.firstPaymentDate,
				amount: 0,
				currency_id: params.currencyId,
				duration_type: null,
				duration_value: null,
				reason: null
			});
		}

		if (timelineRows.length > 0) {
			await db.insert(timelineEventsTable).values(timelineRows);
		}

		// Generator reads the timeline back from DB — no need to pass extras.
		await generateSubscriptionTxs(subscription);

		router.back();
	};

	return save;
};

export default useSaveSubscriptions;
