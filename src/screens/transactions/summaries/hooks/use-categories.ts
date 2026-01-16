import { useMemo } from 'react';
import { format } from 'date-fns';

import type { SummariesQueryReturnT } from './use-summaries';

const DEFAULT_DENOMINATOR = 1;
const __STUB_COLOR = '#ffffff';

type CategoryT = {
	id: string;
	amount: number;
	color: string;
};

type CategoryAccumulatorT = {
	total: number;
	byCategoryId: Record<string, CategoryT>;
};

type TransactionT = SummariesQueryReturnT['month'][number] | SummariesQueryReturnT['year'][number];

type SummaryReturnT = {
	formattedDate: string;
	total: number;
	categories: CategoryT[];
};

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

/*
 * @TODO:
 *	- add support of RECALC
 */
export const useMonth = (transactions: SummariesQueryReturnT): SummaryReturnT => {
	const summary = useMemo(() => computeSummary(transactions.month), [transactions.month]);
	const formattedDate = useMemo(() => format(transactions.dates.month, 'MMMM'), [transactions.dates.month]);

	return {
		...summary,
		formattedDate
	};
};

export const useYear = (transactions: SummariesQueryReturnT): SummaryReturnT => {
	const summary = useMemo(() => computeSummary(transactions.year), [transactions.year]);
	const formattedDate = useMemo(() => format(transactions.dates.year, 'yyyy'), [transactions.dates.year]);

	return {
		...summary,
		formattedDate
	};
};
