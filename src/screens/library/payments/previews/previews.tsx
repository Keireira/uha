import React, { useEffect, useState } from 'react';
import { Pressable, useWindowDimensions } from 'react-native';
import { useRouter } from 'expo-router';

import db from '@db';
import { asc, like } from 'drizzle-orm';
import { tendersTable } from '@db/schema';
import { useLiveQuery } from 'drizzle-orm/expo-sqlite';

import PreviewItem from './preview-item';
import Root, { GridItem, SectionHeader, SectionLetter, SectionRule, EmptyText } from './previews.styles';

import type { Props } from './previews.d';

const COLUMNS = 2;
const GAP = 8;
const PADDING = 20;

const Previews = ({ search }: Props) => {
	const router = useRouter();
	const { width: screenWidth } = useWindowDimensions();
	const [canRender, setCanRender] = useState(false);
	const itemWidth = (screenWidth - PADDING * 2 - GAP * (COLUMNS - 1)) / COLUMNS;

	const { data: payments } = useLiveQuery(
		db
			.select()
			.from(tendersTable)
			.where(like(tendersTable.title, `%${search.trim()}%`))
			.orderBy(asc(tendersTable.title)),
		[search]
	);

	useEffect(() => {
		const timeout = setTimeout(() => {
			setCanRender(true);
		}, 250);

		return () => clearTimeout(timeout);
	}, []);

	if (!payments.length) {
		return <EmptyText>No payment methods</EmptyText>;
	}

	return (
		<Root>
			{canRender &&
				payments.map((payment, index) => {
					const letter = payment.title.charAt(0).toUpperCase();
					const prev = index > 0 ? payments[index - 1].title.charAt(0).toUpperCase() : '';

					return (
						<React.Fragment key={payment.id}>
							{letter !== prev && (
								<SectionHeader>
									<SectionLetter>{letter}</SectionLetter>
									<SectionRule />
								</SectionHeader>
							)}

							<GridItem $width={itemWidth}>
								<Pressable
									onPress={() =>
										router.push({ pathname: '/(tabs)/library/[id]', params: { id: payment.id, type: 'payment' } })
									}
								>
									<PreviewItem {...payment} />
								</Pressable>
							</GridItem>
						</React.Fragment>
					);
				})}
		</Root>
	);
};

export default Previews;
