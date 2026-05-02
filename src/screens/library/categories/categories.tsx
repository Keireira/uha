import React, { useState } from 'react';
import { Stack } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { useTheme } from 'styled-components/native';
import { useFuzzySearchList } from '@nozbe/microfuzz/react';

import db from '@db';
import { asc, eq, sql } from 'drizzle-orm';
import { useLiveQuery } from 'drizzle-orm/expo-sqlite';
import { categoriesTable, subscriptionsTable } from '@db/schema';

import { useAccent } from '@hooks';
import { openLibraryDetails } from '../shared';

import {
	font,
	frame,
	shapes,
	padding,
	listStyle,
	lineLimit,
	contentShape,
	onTapGesture,
	foregroundStyle,
	listRowSeparator,
	listRowBackground,
	scrollTargetBehavior,
	scrollDismissesKeyboard,
	scrollContentBackground
} from '@expo/ui/swift-ui/modifiers';
import { LogoView } from '@ui';
import Toast from 'react-native-toast-message';
import { swipeActions } from '@modules/expo-ui-modifiers';
import { Host, Text, HStack, RNHostView, List, Section } from '@expo/ui/swift-ui';

import type { CategoryT } from '@models';
import type { SFSymbol } from 'expo-symbols';
import type { TextInputChangeEvent } from 'react-native';

type MapResult = {
	item: CategoryT;
};

const Categories = () => {
	const theme = useTheme();
	const { t } = useTranslation();
	const settingAccent = useAccent();
	const [searchQuery, setSearchQuery] = useState('');
	const { data = [] } = useLiveQuery(db.select().from(categoriesTable).orderBy(asc(categoriesTable.title)));

	const getText = (category: CategoryT) => [
		category.title ?? '',
		category.slug,
		category.emoji ?? '',
		t(`category.${category.slug}`, { defaultValue: category.title ?? category.slug })
	];

	const matches = useFuzzySearchList({
		getText,
		list: data,
		queryText: searchQuery,
		mapResultItem: ({ item }: MapResult) => item
	});

	const handleChangeText = (e: TextInputChangeEvent) => {
		setSearchQuery(e.nativeEvent.text.trim());
	};

	const categories = searchQuery ? matches : data;

	const deleteCategory = (slug: string) => async () => {
		const [{ count = 0 } = {}] = await db
			.select({ count: sql<number>`count(*)`.mapWith(Number) })
			.from(subscriptionsTable)
			.where(eq(subscriptionsTable.category_slug, slug));

		if (count > 0) {
			Toast.show({
				type: 'error',
				text1: t('library.delete_blocked.title'),
				text2: t('library.delete_blocked.category', { count })
			});
			return;
		}

		const [{ is_system: isSystem } = {}] = await db
			.select({ is_system: categoriesTable.is_system })
			.from(categoriesTable)
			.where(eq(categoriesTable.slug, slug))
			.limit(1);

		if (isSystem) {
			Toast.show({
				type: 'error',
				text1: t('library.delete_blocked.title'),
				text2: t('library.delete_blocked.default_category')
			});
			return;
		}

		await db.delete(categoriesTable).where(eq(categoriesTable.slug, slug));
	};

	return (
		<>
			<Host style={{ flex: 1 }}>
				<List
					modifiers={[
						listStyle('insetGrouped'),
						scrollDismissesKeyboard('immediately'),
						scrollTargetBehavior('viewAligned'),
						scrollContentBackground('hidden')
					]}
				>
					<Section modifiers={[listRowSeparator('hidden', 'all'), listRowBackground('transparent')]}>
						{categories.map((category) => {
							const title = t(`category.${category.slug}`, { defaultValue: category.title ?? category.slug });

							const openDetails = () => {
								openLibraryDetails('category', category.slug, title);
							};

							return (
								<HStack
									key={category.slug}
									spacing={16}
									modifiers={[
										padding({ vertical: 6, horizontal: 0 }),
										frame({ maxWidth: Number.POSITIVE_INFINITY, alignment: 'leading' }),
										contentShape(shapes.rectangle()),
										onTapGesture(openDetails),
										swipeActions({
											actions: [
												{
													id: 'delete',
													systemImage: 'trash',
													tint: theme.semantic.error,
													onPress: deleteCategory(category.slug)
												}
											]
										})
									]}
								>
									<RNHostView matchContents>
										<LogoView
											key={`${category.slug}-icon`}
											symbolName={category.symbol as SFSymbol}
											name={category.title || ''}
											emoji={category.emoji}
											color={category.color}
											size={48}
										/>
									</RNHostView>

									<Text
										modifiers={[
											font({ size: 18, design: 'rounded', weight: 'regular' }),
											foregroundStyle(theme.text.primary),
											lineLimit(1)
										]}
									>
										{title}
									</Text>
								</HStack>
							);
						})}
					</Section>
				</List>
			</Host>

			<Stack.Toolbar placement="bottom">
				<Stack.SearchBar
					autoFocus={false}
					inputType="text"
					autoCapitalize="none"
					placement="integratedButton"
					hideNavigationBar={false}
					onChangeText={handleChangeText}
					tintColor={settingAccent}
					placeholder="Filter categories"
				/>
			</Stack.Toolbar>
		</>
	);
};

export default Categories;
