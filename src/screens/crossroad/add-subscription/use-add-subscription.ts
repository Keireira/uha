import { useState, useEffect, useMemo } from 'react';
import { useRouter, useLocalSearchParams } from 'expo-router';
import * as Crypto from 'expo-crypto';
import { addDays, format } from 'date-fns';
import { eq } from 'drizzle-orm';
import { useLiveQuery } from 'drizzle-orm/expo-sqlite';

import db from '@db';
import { subscriptionsTable, servicesTable, categoriesTable, currenciesTable, tendersTable } from '@db/schema';
import { getService } from '@api/soup';
import { useGenerateTxs } from '@hooks/setup';

type Params = {
	service_id?: string;
	service_name?: string;
	service_logo?: string;
	service_source?: string;
};

type ResolvedService = {
	id: string;
	name: string;
	slug: string;
	color: string;
	logo_url: string;
	category_slug: string;
};

const ensureLocalService = async (details: {
	id?: string;
	name: string;
	slug: string;
	color: string;
	category_slug: string;
	aliases: string[];
}): Promise<string> => {
	const [existing] = await db.select().from(servicesTable).where(eq(servicesTable.slug, details.slug));
	if (existing) return existing.id;

	let categorySlug = details.category_slug;

	if (categorySlug) {
		const [cat] = await db.select().from(categoriesTable).where(eq(categoriesTable.slug, categorySlug));
		if (!cat) categorySlug = '';
	}

	if (!categorySlug) {
		const [fallback] = await db.select().from(categoriesTable);
		categorySlug = fallback?.slug ?? '';
	}

	const localId = details.id ?? Crypto.randomUUID();

	await db.insert(servicesTable).values({
		id: localId,
		slug: details.slug,
		title: details.name,
		color: details.color,
		aliases: details.aliases,
		category_slug: categorySlug
	});

	return localId;
};

const useAddSubscription = () => {
	const router = useRouter();
	const params = useLocalSearchParams<Params>();
	const generateSubscriptionTxs = useGenerateTxs();

	/* ── Service resolution ─────────────────── */

	const [service, setService] = useState<ResolvedService | null>(null);
	const [resolving, setResolving] = useState(true);

	useEffect(() => {
		let cancelled = false;

		(async () => {
			if (params.service_id) {
				const [row] = await db.select().from(servicesTable).where(eq(servicesTable.id, params.service_id));

				if (!cancelled && row) {
					setService({
						id: row.id,
						name: row.title,
						slug: row.slug,
						color: row.color,
						logo_url: `https://s3.uha.app/logos/${row.slug}.webp`,
						category_slug: row.category_slug
					});
					setResolving(false);
					return;
				}
			}

			try {
				const details = params.service_id ? await getService(params.service_id) : null;
				if (cancelled) return;

				const name = details?.name ?? params.service_name ?? 'Unknown';
				const slug = details?.slug ?? name.toLowerCase().replace(/\s+/g, '-');
				const color = details?.colors?.primary ?? '#888888';
				const categorySlug = details?.category ?? '';
				const aliases = details?.alternative_names ?? [];
				const logoUrl = details?.logo_url ?? params.service_logo ?? '';

				const localId = await ensureLocalService({
					id: details?.id,
					name,
					slug,
					color,
					category_slug: categorySlug,
					aliases
				});

				if (!cancelled) {
					setService({ id: localId, name, slug, color, logo_url: logoUrl, category_slug: categorySlug || '' });
				}
			} catch {
				if (cancelled) return;

				const name = params.service_name ?? 'Unknown';
				const slug = name.toLowerCase().replace(/\s+/g, '-');

				const localId = await ensureLocalService({ name, slug, color: '#888888', category_slug: '', aliases: [] });

				setService({
					id: localId,
					name,
					slug,
					color: '#888888',
					logo_url: params.service_logo ?? '',
					category_slug: ''
				});
			}

			if (!cancelled) setResolving(false);
		})();

		return () => {
			cancelled = true;
		};
	}, [params.service_id, params.service_name, params.service_source, params.service_logo]);

	/* ── Form state ─────────────────────────── */

	const [customName, setCustomName] = useState('');
	const [color, setColor] = useState('');
	const [selectedCategorySlug, setSelectedCategorySlug] = useState('');
	const [cycleType, setCycleType] = useState<'days' | 'weeks' | 'months' | 'years'>('months');
	const [cycleValue, setCycleValue] = useState(1);
	const [price, setPrice] = useState('');
	const [currencyId, setCurrencyId] = useState('USD');
	const [tenderId, setTenderId] = useState('');
	const [firstDate, setFirstDate] = useState(() => format(new Date(), 'yyyy-MM-dd'));

	// Trial
	const [trialEnabled, setTrialEnabled] = useState(false);
	const [trialDays, setTrialDays] = useState('14');

	// Sync color & category from resolved service
	useEffect(() => {
		if (!service) return;
		if (!color) setColor(service.color);
		if (!selectedCategorySlug) setSelectedCategorySlug(service.category_slug);
	}, [service, color, selectedCategorySlug]);

	/* ── DB queries ─────────────────────────── */

	const { data: tenders } = useLiveQuery(db.select().from(tendersTable));
	const { data: currencies } = useLiveQuery(db.select().from(currenciesTable));
	const { data: categories } = useLiveQuery(db.select().from(categoriesTable));

	const selectedCurrency = useMemo(() => currencies?.find((c) => c.id === currencyId), [currencies, currencyId]);

	const priceMinorUnits = useMemo(() => {
		const num = parseFloat(price);
		if (isNaN(num)) return 0;
		return Math.round(num * (selectedCurrency?.denominator ?? 100));
	}, [price, selectedCurrency]);

	// Compute first payment date with trial
	const effectiveFirstDate = useMemo(() => {
		if (!trialEnabled) return firstDate;
		const days = parseInt(trialDays, 10);
		if (isNaN(days) || days <= 0) return firstDate;
		return format(addDays(new Date(firstDate), days), 'yyyy-MM-dd');
	}, [firstDate, trialEnabled, trialDays]);

	const isValid = service !== null && priceMinorUnits > 0 && currencyId.length > 0 && selectedCategorySlug.length > 0;

	const save = async () => {
		if (!isValid || !service) return;

		const subscriptionId = Crypto.randomUUID();

		const subscription = {
			id: subscriptionId,
			service_id: service.id,
			category_slug: selectedCategorySlug,
			custom_name: customName.trim() || null,
			billing_cycle_type: cycleType,
			billing_cycle_value: cycleValue,
			current_price: priceMinorUnits,
			current_currency_id: currencyId,
			first_payment_date: effectiveFirstDate,
			tender_id: tenderId || null,
			cancellation_date: null
		};

		await db.insert(subscriptionsTable).values(subscription);
		await generateSubscriptionTxs(subscription);

		router.back();
	};

	return {
		service,
		resolving,
		customName,
		setCustomName,
		color: color || service?.color || '#888888',
		setColor,
		selectedCategorySlug,
		setSelectedCategorySlug,
		cycleType,
		setCycleType,
		cycleValue,
		setCycleValue,
		price,
		setPrice,
		currencyId,
		setCurrencyId,
		tenderId,
		setTenderId,
		firstDate,
		setFirstDate,
		trialEnabled,
		setTrialEnabled,
		trialDays,
		setTrialDays,
		effectiveFirstDate,
		tenders: tenders ?? [],
		currencies: currencies ?? [],
		categories: categories ?? [],
		selectedCurrency,
		isValid,
		save
	};
};

export default useAddSubscription;
