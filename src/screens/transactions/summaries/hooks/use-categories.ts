import { useMemo } from 'react';
import { format, lightFormat } from 'date-fns';

import db from '@db';
import { eq, between } from 'drizzle-orm';
import { currencyRatesTable } from '@db/schema';

import { useSettingsValue } from '@hooks/use-settings';

import type { PreparedDbTxT } from '@hooks/use-transactions';
import type { CategoryAccumulatorT, TransactionT, SummaryReturnT, SummariesQueryReturnT } from '../summaries.d';
type LastKnownRatesT = Map<string, number>;
type CurrencyRateT = typeof currencyRatesTable.$inferSelect;

const DEFAULT_DENOMINATOR = 1;
const __STUB_COLOR = '#ffffff';
const DEFAULT_SUMMARY = { total: 0, categories: [] };

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
		return DEFAULT_SUMMARY;
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

const calcRatesMap = (ratesInRange: Omit<CurrencyRateT, 'id'>[]) => {
	const ratesMap = new Map<string, Map<string, number>>();

	if (!ratesInRange?.length) {
		return;
	}

	for (const rate of ratesInRange) {
		if (!ratesMap.has(rate.date)) {
			ratesMap.set(rate.date, new Map<string, number>());
		}

		ratesMap.get(rate.date)!.set(rate.target_currency_id, rate.rate);
	}

	return ratesMap;
};

const updatePrices = (
	transactions: TransactionT[],
	rates: Map<string, Map<string, number>> | undefined,
	recalcCurrencyCode: string,
	lastKnownRates: LastKnownRatesT
) => {
	const txsWithRates = [];

	for (const tx of transactions) {
		const ratesByDate = rates?.get(lightFormat(tx.date, 'yyyy-MM-dd')) || lastKnownRates;

		const recalcRate = ratesByDate.get(recalcCurrencyCode) ?? 1;
		const txToUsdRate = ratesByDate.get(tx.currency_code) ?? 1;
		const convertedToUsd = tx.price / txToUsdRate;

		txsWithRates.push({
			...tx,
			price: convertedToUsd * recalcRate
		});
	}

	return txsWithRates;
};

export const useDay = (transactions: SummariesQueryReturnT, lastKnownRates: LastKnownRatesT): SummaryReturnT => {
	const recalcCurrencyCode = useSettingsValue<string>('recalc_currency_code');

	const ratesOnDate = useMemo(() => {
		return db
			.select({
				date: currencyRatesTable.date,
				rate: currencyRatesTable.rate,
				target_currency_id: currencyRatesTable.target_currency_id
			})
			.from(currencyRatesTable)
			.where(eq(currencyRatesTable.date, transactions.dates.dayFormatted))
			.all();
	}, [transactions.dates.dayFormatted]);

	const rates = useMemo(() => {
		if (!ratesOnDate?.length) {
			return lastKnownRates;
		}

		const nextRates = new Map<string, number>();

		for (const rate of ratesOnDate) {
			nextRates.set(rate.target_currency_id, rate.rate);
		}

		return nextRates;
		/* eslint-disable-next-line react-hooks/exhaustive-deps */
	}, [ratesOnDate]);

	const summary = useMemo(() => {
		const txsWithRates: PreparedDbTxT[] = [];
		const recalcRate = rates.get(recalcCurrencyCode) || 1;

		for (const tx of transactions.day) {
			const txToUsdRate = rates.get(tx.currency_code) || 1;
			const convertedToUsd = tx.price / txToUsdRate;

			txsWithRates.push({
				...tx,
				price: convertedToUsd * recalcRate
			});
		}

		return computeSummary(txsWithRates);
	}, [rates, recalcCurrencyCode, transactions.day]);

	const formattedDate = useMemo(() => {
		return format(transactions.dates.dayRaw, 'dd');
		/* eslint-disable-next-line react-hooks/exhaustive-deps */
	}, [transactions.dates.dayFormatted]);

	return {
		...summary,
		formattedDate,
		rawDate: transactions.dates.dayRaw
	};
};

export const useMonth = (transactions: SummariesQueryReturnT, lastKnownRates: LastKnownRatesT): SummaryReturnT => {
	const recalcCurrencyCode = useSettingsValue<string>('recalc_currency_code');

	const ratesInRange = useMemo(() => {
		return db
			.select({
				date: currencyRatesTable.date,
				rate: currencyRatesTable.rate,
				target_currency_id: currencyRatesTable.target_currency_id
			})
			.from(currencyRatesTable)
			.where(
				between(currencyRatesTable.date, transactions.dates.monthStartFormatted, transactions.dates.monthEndFormatted)
			)
			.all();
	}, [transactions.dates.monthStartFormatted, transactions.dates.monthEndFormatted]);

	const rates = useMemo(() => calcRatesMap(ratesInRange), [ratesInRange]);

	const summary = useMemo(() => {
		if (__DEV__) {
			console.log(`\x1b[34m[ACTION]\x1b[0m Summary for \x1b[4m\x1b[1;33mMONTH\x1b[0m has been re-calculated`);
		}

		const txsWithRates = updatePrices(transactions.month, rates, recalcCurrencyCode, lastKnownRates);

		return computeSummary(txsWithRates);
		/* eslint-disable-next-line react-hooks/exhaustive-deps */
	}, [rates, recalcCurrencyCode, transactions.month]);

	const formattedDate = useMemo(
		() => format(transactions.dates.monthStartRaw, 'MMMM'),
		[transactions.dates.monthStartRaw]
	);

	return {
		...summary,
		formattedDate,
		rawDate: transactions.dates.monthStartRaw
	};
};

export const useYear = (transactions: SummariesQueryReturnT, lastKnownRates: LastKnownRatesT): SummaryReturnT => {
	const recalcCurrencyCode = useSettingsValue<string>('recalc_currency_code');

	const ratesInRange = useMemo(() => {
		return db
			.select({
				date: currencyRatesTable.date,
				rate: currencyRatesTable.rate,
				target_currency_id: currencyRatesTable.target_currency_id
			})
			.from(currencyRatesTable)
			.where(
				between(currencyRatesTable.date, transactions.dates.yearStartFormatted, transactions.dates.yearEndFormatted)
			)
			.all();
	}, [transactions.dates.yearStartFormatted, transactions.dates.yearEndFormatted]);

	const rates = useMemo(() => calcRatesMap(ratesInRange), [ratesInRange]);

	const summary = useMemo(() => {
		if (__DEV__) {
			console.log(`\x1b[34m[ACTION]\x1b[0m Summary for \x1b[4m\x1b[1;32mYEAR\x1b[0m has been re-calculated`);
		}

		const txsWithRates = updatePrices(transactions.year, rates, recalcCurrencyCode, lastKnownRates);

		return computeSummary(txsWithRates);
		/* eslint-disable-next-line react-hooks/exhaustive-deps */
	}, [rates, recalcCurrencyCode, transactions.year]);

	const formattedDate = useMemo(
		() => format(transactions.dates.yearStartRaw, 'yyyy'),
		[transactions.dates.yearStartRaw]
	);

	return {
		...summary,
		formattedDate,
		rawDate: transactions.dates.yearStartRaw
	};
};
