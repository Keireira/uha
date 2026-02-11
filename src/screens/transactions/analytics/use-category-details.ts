import { useMemo } from 'react';

import db from '@db';
import { inArray } from 'drizzle-orm';
import { categoriesTable } from '@db/schema';

import type { CategoryT } from '../summaries/summaries.d';

export type EnrichedCategoryT = CategoryT & {
	title: string;
	emoji: string;
	formattedAmount: string;
};

type CurrencyT = {
	id: string;
	intl_locale: string;
	fraction_digits: number;
};

const useCategoryDetails = (categories: CategoryT[], currency: CurrencyT | undefined): EnrichedCategoryT[] => {
	return useMemo(() => {
		if (!categories.length || !currency) {
			return [];
		}

		const categoryIds = categories.map((c) => c.id);

		const dbCategories = db.select().from(categoriesTable).where(inArray(categoriesTable.id, categoryIds)).all();

		const categoryMap = new Map(dbCategories.map((c) => [c.id, c]));

		return categories.map((cat) => {
			const details = categoryMap.get(cat.id);

			const formattedAmount = cat.amount.toLocaleString(currency.intl_locale, {
				style: 'currency',
				currency: currency.id,
				currencyDisplay: 'symbol',
				minimumFractionDigits: cat.amount > 1000 ? 0 : currency.fraction_digits,
				maximumFractionDigits: cat.amount > 1000 ? 0 : currency.fraction_digits
			});

			return {
				...cat,
				title: details?.title ?? 'Unknown',
				emoji: details?.emoji ?? '?',
				formattedAmount
			};
		});
	}, [categories, currency]);
};

export default useCategoryDetails;
