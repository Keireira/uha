import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';

import db from '@db';
import { inArray } from 'drizzle-orm';
import { categoriesTable } from '@db/schema';

import type { TxCategoryT } from '@screens/transactions/transactions.d';

export type EnrichedCategoryT = TxCategoryT & {
	title: string;
	emoji: string;
	formattedAmount: string;
};

type CatCurrencyT = {
	id: string;
	intl_locale: string;
	fraction_digits: number;
};

const useCategoryDetails = (categories: TxCategoryT[], currency: CatCurrencyT | undefined): EnrichedCategoryT[] => {
	const { t } = useTranslation();

	return useMemo(() => {
		if (!categories.length || !currency) {
			return [];
		}

		const categorySlugs = categories.map((c) => c.id);

		const dbCategories = db.select().from(categoriesTable).where(inArray(categoriesTable.slug, categorySlugs)).all();

		const categoryMap = new Map(dbCategories.map((c) => [c.slug, c]));

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
				title: details?.title ?? t(`category.${cat.id}`, { defaultValue: cat.id }),
				emoji: details?.emoji ?? '?',
				formattedAmount
			};
		});
	}, [categories, currency, t]);
};

export default useCategoryDetails;
