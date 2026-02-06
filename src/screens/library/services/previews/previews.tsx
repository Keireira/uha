import React, { useEffect, useState } from 'react';
import { useWindowDimensions } from 'react-native';
import { useRouter } from 'expo-router';

import db from '@db';
import { asc, like } from 'drizzle-orm';
import { servicesTable } from '@db/schema';
import { useLiveQuery } from 'drizzle-orm/expo-sqlite';

import PreviewItem from './preview-item';
import Root, { GridItem, SectionHeader, SectionLetter, SectionRule, EmptyText } from './previews.styles';

import type { Props } from './previews.d';

const COLUMNS = 3;
const GAP = 8;
const PADDING = 20;

const Previews = ({ search }: Props) => {
	const router = useRouter();
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
			{canRender &&
				services.map((service, index) => {
					const letter = service.title.charAt(0).toUpperCase();
					const prev = index > 0 ? services[index - 1].title.charAt(0).toUpperCase() : '';

					return (
						<React.Fragment key={service.id}>
							{letter !== prev && (
								<SectionHeader>
									<SectionLetter>{letter}</SectionLetter>
									<SectionRule />
								</SectionHeader>
							)}

							<GridItem $width={itemWidth}>
								<PreviewItem
									{...service}
									onPress={() =>
										router.push({ pathname: '/(tabs)/library/[id]', params: { id: service.id, type: 'service' } })
									}
								/>
							</GridItem>
						</React.Fragment>
					);
				})}
		</Root>
	);
};

export default Previews;
