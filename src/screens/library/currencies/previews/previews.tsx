import React, { useEffect, useState } from 'react';
import { useWindowDimensions } from 'react-native';

import db from '@db';
import { asc, like } from 'drizzle-orm';
import { currenciesTable } from '@db/schema';
import { useLiveQuery } from 'drizzle-orm/expo-sqlite';

import PreviewItem from './preview-item';
import Root, { GridItem, EmptyText } from './previews.styles';

import type { Props } from './previews.d';

const COLUMNS = 4;
const GAP = 8;
const PADDING = 20;

const Previews = ({ search }: Props) => {
	const { width: screenWidth } = useWindowDimensions();
	const [canRender, setCanRender] = useState(false);
	const itemWidth = (screenWidth - PADDING * 2 - GAP * (COLUMNS - 1)) / COLUMNS;

	const { data: currencies } = useLiveQuery(
		db
			.select()
			.from(currenciesTable)
			.where(like(currenciesTable.id, `%${search.trim().toUpperCase()}%`))
			.orderBy(asc(currenciesTable.id)),
		[search]
	);

	useEffect(() => {
		const timeout = setTimeout(() => {
			setCanRender(true);
		}, 250);

		return () => clearTimeout(timeout);
	}, []);

	if (!currencies.length) {
		return <EmptyText>No currencies</EmptyText>;
	}

	return (
		<Root>
			{canRender && currencies.map((currency) => (
				<GridItem key={currency.id} $width={itemWidth}>
					<PreviewItem {...currency} />
				</GridItem>
			))}
		</Root>
	);
};

export default Previews;
