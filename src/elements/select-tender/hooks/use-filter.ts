import { useState } from 'react';
import { useFuzzySearchList } from '@nozbe/microfuzz/react';

import db from '@db';
import { asc } from 'drizzle-orm';
import { tendersTable } from '@db/schema';
import { useLiveQuery } from 'drizzle-orm/expo-sqlite';

import type { TenderT } from '@models';

const getText = (item: TenderT) => [item.title, item.comment ?? ''];
const mapResultItem = ({ item }: { item: TenderT }) => item;

const NONE_TENDER: TenderT = {
	id: 'c3905427-d934-4142-9fab-5571e3c7a50d',
	title: 'None',
	comment: null,
	emoji: '',
	symbol: 'chevron.compact.up.chevron.compact.right.chevron.compact.down.chevron.compact.left',
	is_card: false,
	color: ''
};

const useFilter = () => {
	const [searchQuery, setSearchQuery] = useState('');
	const { data: tenders } = useLiveQuery(db.select().from(tendersTable).orderBy(asc(tendersTable.title)), []);

	const matches = useFuzzySearchList({
		list: tenders,
		queryText: searchQuery,
		getText,
		mapResultItem
	});

	return {
		tenders: searchQuery ? matches : [NONE_TENDER, ...tenders],
		hasSearch: Boolean(searchQuery),
		setSearchQuery
	};
};

export default useFilter;
