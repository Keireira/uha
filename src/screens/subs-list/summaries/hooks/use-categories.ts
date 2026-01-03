import { useMemo } from 'react';
import { format } from 'date-fns';

import type { TransactionsQueryReturnT } from './use-query';

const DEFAULT_DENOMINATOR = 1;
const DEFAULT_COLOR = '#ffffff';

type CategoryT = {
	id: string;
	amount: number;
	color: string;
};

type CategoryAccumulatorT = {
	total: number;
	byCategoryId: Record<string, CategoryT>;
};

type TransactionT = TransactionsQueryReturnT['month'][number] | TransactionsQueryReturnT['year'][number];

type SummaryT = {
	total: number;
	categories: CategoryT[];
};

type SummaryReturnT = {
	formattedDate: string;
	total: number;
	categories: CategoryT[];
};

const formatCategoryPredicate = (acc: CategoryAccumulatorT, cur: TransactionT) => {
	const denominator = cur.denominator || DEFAULT_DENOMINATOR;
	acc.total += cur.amount / denominator;

	if (!cur.category_id) {
		return acc;
	}

	acc.byCategoryId[cur.category_id] ??= {
		id: cur.category_id,
		color: cur.category_color || DEFAULT_COLOR,
		amount: 0
	};

	acc.byCategoryId[cur.category_id].amount += cur.amount / denominator;

	return acc;
};

const sortCategoriesPredicate = (a: CategoryT, b: CategoryT) => b.amount - a.amount;

/*
 * @TODO:
 *	- add support of RECALC currency
 *	- move denominator up
 */
export const useMonth = (transactions: TransactionsQueryReturnT) => {
	const categoriesMonth = useMemo(() => {
		if (!transactions.month) {
			return { total: 0, categories: [] } satisfies SummaryT;
		}

		const result = transactions.month.reduce(formatCategoryPredicate, {
			total: 0,
			byCategoryId: {}
		} as CategoryAccumulatorT);
		const categories = Object.values(result.byCategoryId);

		return {
			total: result.total,
			categories: categories.sort(sortCategoriesPredicate)
		} satisfies SummaryT;
	}, [transactions.month]);

	const formattedDate = useMemo(() => format(transactions.dates.month, 'MMMM'), [transactions.dates.month]);

	return {
		formattedDate,
		total: categoriesMonth.total,
		categories: categoriesMonth.categories
	} satisfies SummaryReturnT;
};

export const useYear = (transactions: TransactionsQueryReturnT) => {
	const categoriesYear = useMemo(() => {
		if (!transactions.year) {
			return { total: 0, categories: [] } satisfies SummaryT;
		}

		const result = transactions.year.reduce(formatCategoryPredicate, {
			total: 0,
			byCategoryId: {}
		} as CategoryAccumulatorT);
		const categories = Object.values(result.byCategoryId);

		return {
			total: result.total,
			categories: categories.sort(sortCategoriesPredicate)
		} satisfies SummaryT;
	}, [transactions.year]);

	const formattedDate = useMemo(() => format(transactions.dates.year, 'yyyy'), [transactions.dates.year]);

	return {
		formattedDate,
		total: categoriesYear.total,
		categories: categoriesYear.categories
	} satisfies SummaryReturnT;
};
