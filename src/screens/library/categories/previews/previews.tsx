import React, { useEffect, useState } from 'react';
import { asc, like } from 'drizzle-orm';
import { db } from '@src/sql-migrations';
import { categoriesTable } from '@db/schema';
import { useLiveQuery } from 'drizzle-orm/expo-sqlite';

import PreviewItem from './preview-item';
import Section from '@screens/library/section';
import Root, { SnapMark } from './previews.styles';
import { ToAll, NoItems, useLength } from '@screens/library/shared';

import type { Props } from './previews.d';

const Previews = ({ search, setFound }: Props) => {
	const length = useLength(categoriesTable);
	const [canRender, setCanRender] = useState(false);

	const { data: categories } = useLiveQuery(
		db
			.select()
			.from(categoriesTable)
			.where(like(categoriesTable.title, `%${search.trim()}%`))
			.orderBy(asc(categoriesTable.title))
			.limit(6),
		[search]
	);

	useEffect(() => {
		const timeout = window.setTimeout(() => {
			setCanRender(true);
		}, 250);

		return () => window.clearTimeout(timeout);
	}, []);

	useEffect(() => {
		setFound(categories.length);
	}, [setFound, categories.length]);

	// For search results only
	if (!categories.length && search.length > 0) {
		return null;
	}

	return (
		<Section title="Categories" to="/(tabs)/library/categories-list">
			<Root>
				<SnapMark $left />

				{!categories.length && <NoItems title="No categories" />}

				{canRender && categories.map((category) => <PreviewItem key={category.id} {...category} />)}

				{canRender && categories.length >= 1 && length > 6 && <ToAll to="/(tabs)/library/categories-list" />}

				<SnapMark $right />
			</Root>
		</Section>
	);
};

export default Previews;
