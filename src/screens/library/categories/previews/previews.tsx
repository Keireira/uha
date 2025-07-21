import React from 'react';
import { asc } from 'drizzle-orm';
import { db } from '@src/sql-migrations';
import { categoriesTable } from '@db/schema';
import { useLiveQuery } from 'drizzle-orm/expo-sqlite';

import NoItems from './no-items';
import PreviewItem from './preview-item';
import Root, { SnapMark } from './previews.styles';

const Previews = () => {
	const { data: categories } = useLiveQuery(
		db.select().from(categoriesTable).orderBy(asc(categoriesTable.title)).limit(6)
	);

	return (
		<Root>
			<SnapMark $left />

			{!categories.length && <NoItems />}

			{categories.map((category) => (
				<PreviewItem key={category.id} {...category} />
			))}

			<SnapMark $right />
		</Root>
	);
};

export default Previews;
