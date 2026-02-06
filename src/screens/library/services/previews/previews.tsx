import React, { useEffect, useState } from 'react';
import { useWindowDimensions } from 'react-native';

import db from '@db';
import { asc, like } from 'drizzle-orm';
import { servicesTable } from '@db/schema';
import { useLiveQuery } from 'drizzle-orm/expo-sqlite';

import PreviewItem from './preview-item';
import Root, { GridItem, EmptyText } from './previews.styles';

import type { Props } from './previews.d';

const COLUMNS = 3;
const GAP = 8;
const PADDING = 20;

const Previews = ({ search }: Props) => {
	const { width: screenWidth } = useWindowDimensions();
	const [canRender, setCanRender] = useState(false);
	const itemWidth = (screenWidth - PADDING * 2 - GAP * (COLUMNS - 1)) / COLUMNS;

	const { data: services } = useLiveQuery(
		db
			.select()
			.from(servicesTable)
			.where(like(servicesTable.title, `%${search.trim()}%`))
			.orderBy(asc(servicesTable.title)),
		[search]
	);

	useEffect(() => {
		const timeout = setTimeout(() => {
			setCanRender(true);
		}, 250);

		return () => clearTimeout(timeout);
	}, []);

	if (!services.length) {
		return <EmptyText>No services</EmptyText>;
	}

	return (
		<Root>
			{canRender && services.map((service) => (
				<GridItem key={service.id} $width={itemWidth}>
					<PreviewItem {...service} />
				</GridItem>
			))}
		</Root>
	);
};

export default Previews;
