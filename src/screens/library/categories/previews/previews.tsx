import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useWindowDimensions } from 'react-native';
import { router } from 'expo-router';
import { FlashList } from '@shopify/flash-list';

import db from '@db';
import { asc, like } from 'drizzle-orm';
import { categoriesTable } from '@db/schema';

import PreviewItem from './preview-item';
import { GridItem, SectionHeader, SectionLetter, SectionRule, EmptyText } from './previews.styles';

import type { CategoryT } from '@models';
import type { Props } from './previews.d';
import type { ListRenderItemInfo } from '@shopify/flash-list';

const COLUMNS = 3;
const GAP = 8;
const PADDING = 20;

type HeaderItem = { type: 'header'; letter: string };
type CategoryItem = { type: 'item'; category: CategoryT };
type ListItem = HeaderItem | CategoryItem;

const getItemType = (item: ListItem) => item.type;

const overrideItemLayout = (layout: { span?: number }, item: ListItem) => {
	if (item.type === 'header') {
		layout.span = COLUMNS;
	}
};

const keyExtractor = (item: ListItem) => (item.type === 'header' ? `header-${item.letter}` : item.category.id);

const contentContainerStyle = { paddingHorizontal: PADDING };

const Previews = ({ search }: Props) => {
	const { width: screenWidth } = useWindowDimensions();
	const itemWidth = (screenWidth - PADDING * 2 - GAP * (COLUMNS - 1)) / COLUMNS;
	const [categories, setCategories] = useState<CategoryT[]>([]);

	useEffect(() => {
		let cancelled = false;

		(async () => {
			const result = await db
				.select()
				.from(categoriesTable)
				.where(like(categoriesTable.title, `%${search.trim()}%`))
				.orderBy(asc(categoriesTable.title));

			if (!cancelled) setCategories(result);
		})();

		return () => {
			cancelled = true;
		};
	}, [search]);

	const listData = useMemo(() => {
		const items: ListItem[] = [];

		categories.forEach((category, index) => {
			const letter = category.title.charAt(0).toUpperCase();
			const prev = index > 0 ? categories[index - 1].title.charAt(0).toUpperCase() : '';

			if (letter !== prev) {
				items.push({ type: 'header', letter });
			}

			items.push({ type: 'item', category });
		});

		return items;
	}, [categories]);

	const handlePress = useCallback((id: string) => {
		requestAnimationFrame(() => {
			router.push({ pathname: '/(tabs)/library/[id]', params: { id, type: 'category' } });
		});
	}, []);

	const renderItem = useCallback(
		({ item }: ListRenderItemInfo<ListItem>) => {
			if (item.type === 'header') {
				return (
					<SectionHeader>
						<SectionLetter>{item.letter}</SectionLetter>
						<SectionRule />
					</SectionHeader>
				);
			}

			return (
				<GridItem $width={itemWidth}>
					<PreviewItem {...item.category} onPress={handlePress} />
				</GridItem>
			);
		},
		[itemWidth, handlePress]
	);

	if (!categories.length) {
		return <EmptyText>No categories</EmptyText>;
	}

	return (
		<FlashList
			data={listData}
			numColumns={COLUMNS}
			showsVerticalScrollIndicator={false}
			contentContainerStyle={contentContainerStyle}
			getItemType={getItemType}
			overrideItemLayout={overrideItemLayout}
			renderItem={renderItem}
			keyExtractor={keyExtractor}
		/>
	);
};

export default Previews;
