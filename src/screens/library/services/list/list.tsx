import React from 'react';
import { useRouter } from 'expo-router';
import { db } from '@src/sql-migrations';
import { asc, like, eq } from 'drizzle-orm';
import { useLiveQuery } from 'drizzle-orm/expo-sqlite';
import { servicesTable, categoriesTable } from '@db/schema';

import { LogoView } from '@ui';
import logos from '@assets/logos';
import { ArrowLeftIcon } from '@ui/icons';
import Root, { ServiceRoot, Title, Header, HeaderTitle, Subtitle, Description, Icon } from './list.styles';

import type { Props } from './list.d';

const CategoriesListScreen = ({ search }: Props) => {
	const router = useRouter();

	const { data: services } = useLiveQuery(
		db
			.select()
			.from(servicesTable)
			.where(like(servicesTable.title, `%${search.trim()}%`))
			.orderBy(asc(servicesTable.title))
			.leftJoin(categoriesTable, eq(servicesTable.category_id, categoriesTable.id)),
		[search]
	);

	const navigateTo = () => {
		router.dismiss(1);
	};

	return (
		<Root>
			<Header hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }} onPress={navigateTo}>
				<ArrowLeftIcon width={18} height={18} color="#333" />

				<HeaderTitle>Library</HeaderTitle>
			</Header>

			{services.map(({ categories, services }) => {
				const color = services.color || categories?.color || '#333333';
				const logoUrl = services.slug ? logos[services.slug as keyof typeof logos] : null;

				return (
					<ServiceRoot key={services.id}>
						<Icon $color={color}>
							<LogoView name={services.title} logoId={logoUrl} color={color} size={48} />
						</Icon>

						<Description>
							<Title $withComment={Boolean(categories?.title)}>{services.title}</Title>
							{categories?.title && <Subtitle>{categories.title}</Subtitle>}
						</Description>
					</ServiceRoot>
				);
			})}
		</Root>
	);
};

export default CategoriesListScreen;
