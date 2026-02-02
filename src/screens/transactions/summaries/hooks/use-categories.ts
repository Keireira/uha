import { useMemo } from 'react';
import { format, lightFormat } from 'date-fns';

import db from '@db';
import { eq } from 'drizzle-orm';
import { currencyRatesTable } from '@db/schema';
import { useLiveQuery } from 'drizzle-orm/expo-sqlite';

import { useSettingsValue } from '@hooks/use-settings';

import type { PreparedDbTxT } from '@hooks/use-transactions';
import type { CategoryAccumulatorT, TransactionT, SummaryReturnT, SummariesQueryReturnT } from '../summaries.d';
type LastKnownRatesT = Map<string, number>;

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

export const useDay = (transactions: SummariesQueryReturnT, lastKnownRates: LastKnownRatesT): SummaryReturnT => {
	const recalcCurrencyCode = useSettingsValue<string>('recalc_currency_code');

	const { data: ratesOnDate } = useLiveQuery(
		db
			.select()
			.from(currencyRatesTable)
			.where(eq(currencyRatesTable.date, lightFormat(transactions.dates.day, 'yyyy-MM-dd')))
	);

	const relatedRates = useMemo(() => {
		if (!ratesOnDate?.length) {
			return lastKnownRates;
		}

		const nextRates = new Map<string, number>();

		for (const rate of ratesOnDate) {
			nextRates.set(rate.target_currency_id, rate.rate);
		}

		return nextRates;
	}, [ratesOnDate?.length, transactions.dates.day, lastKnownRates]);

	const summary = useMemo(() => {
		const txsWithRates: PreparedDbTxT[] = [];
		const recalcRate = relatedRates.get(recalcCurrencyCode) || 1;

		for (const tx of transactions.day) {
			const txToUsdRate = relatedRates.get(tx.currency_code) || 1;
			const convertedToUsd = tx.price / txToUsdRate;

			txsWithRates.push({
				...tx,
				price: convertedToUsd * recalcRate
			});
		}

		return computeSummary(txsWithRates);
	}, [relatedRates, recalcCurrencyCode, transactions.day]);

	const formattedDate = useMemo(() => format(transactions.dates.day, 'dd'), [transactions.dates.day]);

	return {
		...summary,
		formattedDate,
		rawDate: transactions.dates.day
	};
};

export const useMonth = (transactions: SummariesQueryReturnT, lastKnownRates: LastKnownRatesT): SummaryReturnT => {
	const summary = useMemo(() => computeSummary(transactions.month), [transactions.month]);
	const formattedDate = useMemo(() => format(transactions.dates.monthStart, 'MMMM'), [transactions.dates.monthStart]);

	return {
		...summary,
		formattedDate,
		rawDate: transactions.dates.monthStart
	};
};

export const useYear = (transactions: SummariesQueryReturnT, lastKnownRates: LastKnownRatesT): SummaryReturnT => {
	const summary = useMemo(() => computeSummary(transactions.year), [transactions.year]);
	const formattedDate = useMemo(() => format(transactions.dates.yearStart, 'yyyy'), [transactions.dates.yearStart]);

	return {
		...summary,
		formattedDate,
		rawDate: transactions.dates.yearStart
	};
};
