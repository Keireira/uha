import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { router } from 'expo-router';
import { useTheme } from 'styled-components/native';
import { FlashList } from '@shopify/flash-list';

import db from '@db';
import { asc, like, eq } from 'drizzle-orm';
import { servicesTable, categoriesTable } from '@db/schema';

import { LogoView } from '@ui';
import logos from '@assets/logos';
import { ArrowLeftIcon } from '@ui/icons';
import { ServiceRoot, Title, Header, HeaderTitle, Subtitle, Description, Icon, SectionLetter } from './list.styles';

import type { Props } from './list.d';
import type { ListRenderItemInfo } from '@shopify/flash-list';

type JoinedRow = {
	services: typeof servicesTable.$inferSelect;
	categories: typeof categoriesTable.$inferSelect | null;
};
type HeaderItem = { type: 'header'; letter: string };
type ServiceItem = { type: 'item'; row: JoinedRow };
type ListItem = HeaderItem | ServiceItem;

const getItemType = (item: ListItem) => item.type;

const keyExtractor = (item: ListItem) => (item.type === 'header' ? `header-${item.letter}` : item.row.services.id);

const contentContainerStyle = { paddingHorizontal: 20 };

const ServicesListScreen = ({ search }: Props) => {
	const theme = useTheme();
	const [data, setData] = useState<JoinedRow[]>([]);

	useEffect(() => {
		let cancelled = false;

		(async () => {
			const result = await db
				.select()
				.from(servicesTable)
				.where(like(servicesTable.title, `%${search.trim()}%`))
				.orderBy(asc(servicesTable.title))
				.leftJoin(categoriesTable, eq(servicesTable.category_id, categoriesTable.id));

			if (!cancelled) setData(result);
		})();

		return () => { cancelled = true; };
	}, [search]);

	const listData = useMemo(() => {
		const items: ListItem[] = [];

		data.forEach((row, index) => {
			const letter = row.services.title.charAt(0).toUpperCase();
			const prev = index > 0 ? data[index - 1].services.title.charAt(0).toUpperCase() : '';

			if (letter !== prev) {
				items.push({ type: 'header', letter });
			}

			items.push({ type: 'item', row });
		});

		return items;
	}, [data]);

	const navigateTo = useCallback(() => {
		router.dismiss(1);
	}, []);

	const handlePress = useCallback((id: string) => {
		requestAnimationFrame(() => {
			router.push({ pathname: '/(tabs)/library/[id]', params: { id, type: 'service' } });
		});
	}, []);

	const listHeader = useMemo(
		() => (
			<Header hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }} onPress={navigateTo}>
				<ArrowLeftIcon width={14} height={14} color={theme.text.tertiary} />
				<HeaderTitle>Library</HeaderTitle>
			</Header>
		),
		[navigateTo, theme.text.tertiary]
	);

	const renderItem = useCallback(
		({ item }: ListRenderItemInfo<ListItem>) => {
			if (item.type === 'header') {
				return <SectionLetter>{item.letter}</SectionLetter>;
			}

			const { services, categories } = item.row;
			const color = services.color || categories?.color || '#333333';
			const logoUrl = services.slug ? logos[services.slug as keyof typeof logos] : null;

			return (
				<ServiceRoot onPress={() => handlePress(services.id)}>
					<Icon>
						<LogoView name={services.title} logoId={logoUrl} color={color} size={34} />
					</Icon>

					<Description>
						<Title $withComment={Boolean(categories?.title)}>{services.title}</Title>
						{categories?.title && <Subtitle>{categories.title}</Subtitle>}
					</Description>
				</ServiceRoot>
			);
		},
		[handlePress]
	);

	return (
		<FlashList
			data={listData}
			showsVerticalScrollIndicator={false}
			contentContainerStyle={contentContainerStyle}
			ListHeaderComponent={listHeader}
			getItemType={getItemType}
			renderItem={renderItem}
			keyExtractor={keyExtractor}
		/>
	);
};

export default ServicesListScreen;
