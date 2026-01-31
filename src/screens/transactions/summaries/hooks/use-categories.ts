import { useMemo } from 'react';
import { format, lightFormat, startOfMonth, endOfMonth, startOfYear, endOfYear } from 'date-fns';

import db from '@db';
import { currencyRatesTable } from '@db/schema';
import { eq, and, lte, gte, desc } from 'drizzle-orm';
import { useLiveQuery } from 'drizzle-orm/expo-sqlite';

import { useSettingsValue } from '@hooks';

import type { CategoryAccumulatorT, TransactionT, SummaryReturnT, SummariesQueryReturnT } from '../summaries.d';

const DEFAULT_DENOMINATOR = 1;
const __STUB_COLOR = '#ffffff';

const formatCategoryPredicate = (acc: CategoryAccumulatorT, tx: TransactionT) => {
	const denominator = tx.denominator || DEFAULT_DENOMINATOR;
	acc.total += tx.price / denominator;

	if (!tx.category_id) {
		return acc;
	}

	acc.byCategoryId[tx.category_id] ??= {
		id: tx.category_id,
		color: tx.category_color || __STUB_COLOR,
		amount: 0
	};

	acc.byCategoryId[tx.category_id].amount += tx.price / denominator;

	return acc;
};

const computeSummary = (data: TransactionT[]) => {
	if (!data.length) {
		return { total: 0, categories: [] };
	}

	const result = data.reduce(formatCategoryPredicate, {
		total: 0,
		byCategoryId: {}
	} as CategoryAccumulatorT);

	const sortedCategories = Object.values(result.byCategoryId).sort((a, b) => b.amount - a.amount);

	return {
		total: result.total,
		categories: sortedCategories
	};
};

export const useDay = (transactions: SummariesQueryReturnT): SummaryReturnT => {
	const recalcCurrencyCode = useSettingsValue<string>('recalc_currency_code');
	const { rates: lastKnownRates } = useGetLastKnownRates();

	const { data: dataRates } = useLiveQuery(
		db
			.select()
			.from(currencyRatesTable)
			.where(eq(currencyRatesTable.date, lightFormat(transactions.dates.day, 'yyyy-MM-dd'))),
		[transactions.dates.day]
	);

	const rates = useMemo(() => {
		const ratesMap = new Map<string, number>();

		if (!dataRates?.length) {
			return ratesMap;
		}

		for (const rate of dataRates) {
			ratesMap.set(rate.target_currency_id, rate.rate);
		}

		return ratesMap;
	}, [dataRates]);

	const summary = useMemo(() => {
		const txsWithRates = [];
		const recalcRate = rates.get(recalcCurrencyCode) ?? lastKnownRates.get(recalcCurrencyCode) ?? 1;

		for (const tx of transactions.day) {
			const txToUsdRate = rates.get(tx.currency_code) ?? lastKnownRates.get(tx.currency_code) ?? 1;
			const convertedToUsd = tx.price / txToUsdRate;

			txsWithRates.push({
				...tx,
				price: convertedToUsd * recalcRate
			});
		}

		return computeSummary(txsWithRates);
	}, [transactions.day, rates, recalcCurrencyCode, lastKnownRates]);

	const formattedDate = useMemo(() => format(transactions.dates.day, 'dd'), [transactions.dates.day]);

	return {
		...summary,
		formattedDate,
		rawDate: transactions.dates.day
	};
};

const useGetLastKnownRates = () => {
	const {
		data: [lastKnownRate]
	} = useLiveQuery(db.select().from(currencyRatesTable).orderBy(desc(currencyRatesTable.date)).limit(1), []);

	const { data: allRatesForDate } = useLiveQuery(
		db
			.select()
			.from(currencyRatesTable)
			.where(eq(currencyRatesTable.date, lastKnownRate?.date ?? '')),
		[lastKnownRate?.date]
	);

	const rates = useMemo(() => {
		const ratesMap = new Map<string, number>();

		if (!allRatesForDate?.length) {
			return ratesMap;
		}

		for (const rate of allRatesForDate) {
			ratesMap.set(rate.target_currency_id, rate.rate);
		}

		return ratesMap;
	}, [allRatesForDate]);

	return { date: lastKnownRate?.date, rates };
};

export const useMonth = (transactions: SummariesQueryReturnT): SummaryReturnT => {
	const recalcCurrencyCode = useSettingsValue<string>('recalc_currency_code');
	const { rates: lastKnownRates } = useGetLastKnownRates();

	const { data: dataRates } = useLiveQuery(
		db
			.select()
			.from(currencyRatesTable)
			.where(
				and(
					gte(currencyRatesTable.date, lightFormat(startOfMonth(transactions.dates.month), 'yyyy-MM-dd')),
					lte(currencyRatesTable.date, lightFormat(endOfMonth(transactions.dates.month), 'yyyy-MM-dd'))
				)
			),
		[transactions.dates.month]
	);

	const rates = useMemo(() => {
		const ratesMap = new Map<string, Map<string, number>>();

		for (const rate of dataRates) {
			if (!ratesMap.has(rate.date)) {
				ratesMap.set(rate.date, new Map<string, number>());
			}

			ratesMap.get(rate.date)?.set(rate.target_currency_id, rate.rate);
		}

		return ratesMap;
	}, [dataRates]);

	const summary = useMemo(() => {
		const txsWithRates = [];

		for (const tx of transactions.month) {
			const ratesByDate = rates.get(lightFormat(tx.date, 'yyyy-MM-dd')) || lastKnownRates;

			const recalcRate = ratesByDate.get(recalcCurrencyCode) ?? 1;
			const txToUsdRate = ratesByDate.get(tx.currency_code) ?? 1;
			const convertedToUsd = tx.price / txToUsdRate;

			txsWithRates.push({
				...tx,
				price: convertedToUsd * recalcRate
			});
		}

		return computeSummary(txsWithRates);
	}, [transactions.month, rates, recalcCurrencyCode, lastKnownRates]);

	const formattedDate = useMemo(() => format(transactions.dates.month, 'MMMM'), [transactions.dates.month]);

	return {
		...summary,
		formattedDate,
		rawDate: transactions.dates.month
	};
};

export const useYear = (transactions: SummariesQueryReturnT): SummaryReturnT => {
	const recalcCurrencyCode = useSettingsValue<string>('recalc_currency_code');
	const { rates: lastKnownRates } = useGetLastKnownRates();

	const { data: dataRates } = useLiveQuery(
		db
			.select()
			.from(currencyRatesTable)
			.where(
				and(
					gte(currencyRatesTable.date, lightFormat(startOfYear(transactions.dates.year), 'yyyy-MM-dd')),
					lte(currencyRatesTable.date, lightFormat(endOfYear(transactions.dates.year), 'yyyy-MM-dd'))
				)
			),
		[transactions.dates.year]
	);

	const rates = useMemo(() => {
		const ratesMap = new Map<string, Map<string, number>>();

		for (const rate of dataRates) {
			if (!ratesMap.has(rate.date)) {
				ratesMap.set(rate.date, new Map<string, number>());
			}

			ratesMap.get(rate.date)?.set(rate.target_currency_id, rate.rate);
		}

		return ratesMap;
	}, [dataRates]);

	const summary = useMemo(() => {
		const txsWithRates = [];

		for (const tx of transactions.year) {
			const ratesByDate = rates.get(lightFormat(tx.date, 'yyyy-MM-dd')) || lastKnownRates;

			const recalcRate = ratesByDate.get(recalcCurrencyCode) ?? 1;
			const txToUsdRate = ratesByDate.get(tx.currency_code) ?? 1;
			const convertedToUsd = tx.price / txToUsdRate;

			txsWithRates.push({
				...tx,
				price: convertedToUsd * recalcRate
			});
		}

		return computeSummary(txsWithRates);
	}, [transactions.year, rates, recalcCurrencyCode, lastKnownRates]);

	const formattedDate = useMemo(() => format(transactions.dates.year, 'yyyy'), [transactions.dates.year]);

	return {
		...summary,
		formattedDate,
		rawDate: transactions.dates.year
	};
};
