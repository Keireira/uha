import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useFuzzySearchList } from '@nozbe/microfuzz/react';

import db from '@db';
import { asc } from 'drizzle-orm';
import { categoriesTable } from '@db/schema';
import { useLiveQuery } from 'drizzle-orm/expo-sqlite';

import type { CategoryT } from '@models';

const mapResultItem = ({ item }: { item: CategoryT }) => item;

const useFilter = () => {
	const { t } = useTranslation();
	const [searchQuery, setSearchQuery] = useState('');
	const { data: categories } = useLiveQuery(db.select().from(categoriesTable).orderBy(asc(categoriesTable.title)), []);

	const getText = (item: CategoryT) => {
		return [item.title, t(`category.${item.slug}`, { defaultValue: item.title })];
	};

	const matches = useFuzzySearchList({
		list: categories,
		queryText: searchQuery,
		getText,
		mapResultItem
	});

	return {
		categories: searchQuery ? matches : categories,
		hasSearch: Boolean(searchQuery),
		setSearchQuery
	};
};

export default useFilter;
