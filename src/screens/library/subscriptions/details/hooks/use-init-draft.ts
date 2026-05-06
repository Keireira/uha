import { useEffect, useRef, useState } from 'react';
import { useLocalSearchParams } from 'expo-router';

import db from '@db';
import { eq, inArray } from 'drizzle-orm';
import { currenciesTable, servicesTable, subscriptionsTable, timelineEventsTable } from '@db/schema';

import { useAccent, useSettingsValue } from '@hooks';
import { useDraftStore } from '@screens/crossroad/add-subscription/hooks';
import { isPricedEvent } from '@screens/crossroad/add-subscription/events';

import type { CurrencyT, ServiceT, SubscriptionT } from '@models';
import type { SFSymbol } from 'expo-symbols';
import type { LogoDraftT, SubscriptionDraftT, TimelineEventT } from '@screens/crossroad/add-subscription/events';

type LocalSearchParams = {
	id: string;
	title: string;
	type: 'subscription';
};

type LoadedSubscription = {
	subscription: SubscriptionT;
	service: ServiceT;
};

type TimelineRow = typeof timelineEventsTable.$inferSelect;

const toMajor = (minor: number, denominator: number) => (denominator > 0 ? minor / denominator : minor);

const rowToTimelineEvent = (row: TimelineRow, denominators: Map<string, number>): TimelineEventT | null => {
	const base = { id: row.id, date: row.date };

	switch (row.type) {
		case 'first_payment':
		case 'price_up':
		case 'price_down':
		case 'refund': {
			const currency_id = (row.currency_id ?? '') as CurrencyT['id'];
			if (!currency_id) return null;
			const denominator = denominators.get(currency_id) ?? 1;

			return {
				...base,
				type: row.type,
				amount: row.amount != null ? toMajor(row.amount, denominator) : null,
				currency_id
			};
		}

		case 'trial':
			return {
				...base,
				type: 'trial',
				duration_type: (row.duration_type ?? 'weeks') as TimelineEventT extends { duration_type: infer D } ? D : never,
				duration_value: row.duration_value ?? 1
			};

		case 'pause':
		case 'cancellation':
			return {
				...base,
				type: row.type,
				reason: row.reason ?? ''
			};

		case 'resume':
			return { ...base, type: 'resume' };

		default:
			return null;
	}
};

const buildDraftFromSubscription = (
	subscription: SubscriptionT,
	service: ServiceT,
	timeline: TimelineEventT[],
	settingAccent: string
): SubscriptionDraftT => {
	const customSymbol = (subscription.custom_symbol as SFSymbol | null) || null;
	const customLogo = subscription.custom_logo || null;
	const fallbackSymbol = customSymbol ?? (service.symbol as SFSymbol | null);
	const fallbackImage = customLogo ?? service.logo_url ?? null;

	const logo: LogoDraftT = {
		image_uri: fallbackSymbol ? undefined : fallbackImage || undefined,
		symbol: (fallbackSymbol ?? undefined) as LogoDraftT['symbol'],
		color: service.color || settingAccent
	};

	return {
		logo,
		custom_name: subscription.custom_name || service.title,
		tender_id: subscription.tender_id ?? null,
		category_slug: subscription.category_slug,
		billing_cycle_type: subscription.billing_cycle_type,
		billing_cycle_value: subscription.billing_cycle_value,
		notify_enabled: subscription.notify_enabled,
		notify_days_before: subscription.notify_days_before,
		notify_trial_end: subscription.notify_trial_end,
		notes: subscription.notes ?? '',
		timeline
	};
};

const useInitDraft = () => {
	const { id } = useLocalSearchParams<LocalSearchParams>();
	const settingAccent = useAccent();
	const defaultCurrency = useSettingsValue<string>('default_currency');

	const initSubscription = useDraftStore((state) => state.actions.init);
	const resetSubscription = useDraftStore((state) => state.actions.reset);

	const [loaded, setLoaded] = useState<LoadedSubscription | null>(null);
	const initedRef = useRef(false);

	useEffect(() => {
		if (!id || initedRef.current) return;
		let cancelled = false;

		const load = async () => {
			const [row] = await db
				.select({
					subscription: subscriptionsTable,
					service: servicesTable
				})
				.from(subscriptionsTable)
				.innerJoin(servicesTable, eq(subscriptionsTable.service_id, servicesTable.id))
				.where(eq(subscriptionsTable.id, id))
				.limit(1);

			if (!row || cancelled) return;

			const eventRows = await db.select().from(timelineEventsTable).where(eq(timelineEventsTable.subscription_id, id));

			const currencyIds = [...new Set(eventRows.map((e) => e.currency_id).filter((c): c is string => Boolean(c)))];
			const denominators = new Map<string, number>();
			if (currencyIds.length > 0) {
				const rows = await db.select().from(currenciesTable).where(inArray(currenciesTable.id, currencyIds));
				for (const r of rows) {
					denominators.set(r.id, r.denominator);
				}
			}

			const timeline = eventRows
				.map((r) => rowToTimelineEvent(r, denominators))
				.filter((e): e is TimelineEventT => Boolean(e));

			const draft = buildDraftFromSubscription(row.subscription, row.service, timeline, settingAccent);
			const fallbackCurrency = (timeline.find(isPricedEvent)?.currency_id ??
				defaultCurrency ??
				'USD') as CurrencyT['id'];

			if (cancelled) return;

			initSubscription(row.service, {
				currency_id: fallbackCurrency,
				draft
			});
			initedRef.current = true;
			setLoaded({ subscription: row.subscription, service: row.service });
		};

		void load();

		return () => {
			cancelled = true;
		};
	}, [id, initSubscription, settingAccent, defaultCurrency]);

	useEffect(() => {
		return () => {
			resetSubscription();
			initedRef.current = false;
		};
	}, [resetSubscription]);

	return loaded;
};

export default useInitDraft;
