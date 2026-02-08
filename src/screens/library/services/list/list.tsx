import React from 'react';
import { useRouter } from 'expo-router';
import { useTheme } from 'styled-components/native';

import db from '@db';
import { asc, like, eq } from 'drizzle-orm';
import { useLiveQuery } from 'drizzle-orm/expo-sqlite';
import { servicesTable, categoriesTable } from '@db/schema';

import { LogoView } from '@ui';
import logos from '@assets/logos';
import { ArrowLeftIcon } from '@ui/icons';
import Root, {
	ServiceRoot,
	Title,
	Header,
	HeaderTitle,
	Subtitle,
	Description,
	Icon,
	SectionLetter
} from './list.styles';

import type { Props } from './list.d';

const ServicesListScreen = ({ search }: Props) => {
	const router = useRouter();
	const theme = useTheme();

	const { data } = useLiveQuery(
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
				<ArrowLeftIcon width={14} height={14} color={theme.text.tertiary} />
				<HeaderTitle>Library</HeaderTitle>
			</Header>

			{data.map((row, index) => {
				const { services, categories } = row;
				const color = services.color || categories?.color || '#333333';
				const logoUrl = services.slug ? logos[services.slug as keyof typeof logos] : null;
				const letter = services.title.charAt(0).toUpperCase();
				const prev = index > 0 ? data[index - 1].services.title.charAt(0).toUpperCase() : '';

				return (
					<React.Fragment key={services.id}>
						{letter !== prev && <SectionLetter>{letter}</SectionLetter>}

						<ServiceRoot
							onPress={() =>
								router.push({ pathname: '/(tabs)/library/[id]', params: { id: services.id, type: 'service' } })
							}
						>
							<Icon $color={color}>
								<LogoView name={services.title} logoId={logoUrl} color={color} size={36} />
							</Icon>

							<Description>
								<Title $withComment={Boolean(categories?.title)}>{services.title}</Title>
								{categories?.title && <Subtitle>{categories.title}</Subtitle>}
							</Description>
						</ServiceRoot>
					</React.Fragment>
				);
			})}
		</Root>
	);
};

export default ServicesListScreen;
