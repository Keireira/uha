import React, { useEffect, useState } from 'react';
import { useWindowDimensions } from 'react-native';

import db from '@db';
import { asc, like } from 'drizzle-orm';
import { categoriesTable } from '@db/schema';
import { useLiveQuery } from 'drizzle-orm/expo-sqlite';

import PreviewItem from './preview-item';
import Root, { GridItem, SectionHeader, SectionLetter, SectionRule, EmptyText } from './previews.styles';

import type { Props } from './previews.d';

const COLUMNS = 3;
const GAP = 8;
const PADDING = 20;

const Previews = ({ search }: Props) => {
	const { width: screenWidth } = useWindowDimensions();
	const [canRender, setCanRender] = useState(false);
	const itemWidth = (screenWidth - PADDING * 2 - GAP * (COLUMNS - 1)) / COLUMNS;

	const { data: categories } = useLiveQuery(
		db
			.select()
			.from(categoriesTable)
			.where(like(categoriesTable.title, `%${search.trim()}%`))
			.orderBy(asc(categoriesTable.title)),
		[search]
	);

	useEffect(() => {
		const timeout = window.setTimeout(() => {
			setCanRender(true);
		}, 250);

		return () => window.clearTimeout(timeout);
	}, []);

	if (!categories.length) {
		return <EmptyText>No categories</EmptyText>;
	}

	return (
		<Root>
			{canRender &&
				categories.map((category, index) => {
					const letter = category.title.charAt(0).toUpperCase();
					const prev = index > 0 ? categories[index - 1].title.charAt(0).toUpperCase() : '';

					return (
						<React.Fragment key={category.id}>
							{letter !== prev && (
								<SectionHeader>
									<SectionLetter>{letter}</SectionLetter>
									<SectionRule />
								</SectionHeader>
							)}

							<GridItem $width={itemWidth}>
								<PreviewItem {...category} />
							</GridItem>
						</React.Fragment>
					);
				})}
		</Root>
	);
};

export default Previews;
