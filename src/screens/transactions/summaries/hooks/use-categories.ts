import { useMemo } from 'react';
import { format, lightFormat } from 'date-fns';

import db from '@db';
import { eq } from 'drizzle-orm';
import { currencyRatesTable } from '@db/schema';
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

	const { data: rates } = useLiveQuery(
		db
			.select()
			.from(currencyRatesTable)
			.where(eq(currencyRatesTable.date, lightFormat(transactions.dates.day, 'yyyy-MM-dd'))),
		[transactions.dates.day]
	);

	const summary = useMemo(() => {
		if (!rates?.length) {
			return computeSummary(transactions.day);
		}

		const txsWithRates = [];

		const ratesMap = new Map(rates.map(({ target_currency_id, rate }) => [target_currency_id, rate]));
		const recalcRate = ratesMap.get(recalcCurrencyCode) ?? 1;

		for (const tx of transactions.day) {
			const txToUsdRate = ratesMap.get(tx.currency_code) ?? 1;
			const convertedToUsd = tx.price / txToUsdRate;

			txsWithRates.push({
				...tx,
				price: convertedToUsd * recalcRate
			});
		}

		return computeSummary(txsWithRates);
	}, [transactions.day, rates, recalcCurrencyCode]);

	const formattedDate = useMemo(() => format(transactions.dates.day, 'dd'), [transactions.dates.day]);

	return {
		...summary,
		formattedDate,
		rawDate: transactions.dates.day
	};
};

/*
 * @TODO:
 *	- add support of RECALC
 */
export const useMonth = (transactions: SummariesQueryReturnT): SummaryReturnT => {
	const summary = useMemo(() => computeSummary(transactions.month), [transactions.month]);
	const formattedDate = useMemo(() => format(transactions.dates.month, 'MMMM'), [transactions.dates.month]);

	return {
		...summary,
		formattedDate,
		rawDate: transactions.dates.month
	};
};

/*
 * @TODO:
 *	- add support of RECALC
 */
export const useYear = (transactions: SummariesQueryReturnT): SummaryReturnT => {
	const summary = useMemo(() => computeSummary(transactions.year), [transactions.year]);
	const formattedDate = useMemo(() => format(transactions.dates.year, 'yyyy'), [transactions.dates.year]);

	return {
		...summary,
		formattedDate,
		rawDate: transactions.dates.year
	};
};
