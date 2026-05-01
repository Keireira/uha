import React, { useState } from 'react';
import { Stack } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { useTheme } from 'styled-components/native';
import { useFuzzySearchList } from '@nozbe/microfuzz/react';

import { useAccent } from '@hooks';
import { withAlpha } from '@lib/colors';

import db from '@db';
import { asc, eq, sql } from 'drizzle-orm';
import { useLiveQuery } from 'drizzle-orm/expo-sqlite';
import { categoriesTable, subscriptionsTable } from '@db/schema';

import { openLibraryDetails } from '../shared';

import {
	font,
	frame,
	padding,
	listStyle,
	lineLimit,
	onTapGesture,
	foregroundStyle,
	listRowSeparator,
	listRowBackground,
	scrollTargetBehavior,
	scrollDismissesKeyboard,
	scrollContentBackground
} from '@expo/ui/swift-ui/modifiers';
import Toast from 'react-native-toast-message';
import { swipeActions } from '@modules/expo-ui-modifiers';
import { Host, Text, HStack, VStack, ZStack, Circle, List, Section, Spacer } from '@expo/ui/swift-ui';

import type { CategoryT } from '@models';
import type { TextInputChangeEvent } from 'react-native';

const mapResultItem = ({ item }: { item: CategoryT }) => item;

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
		list: data,
		queryText: searchQuery,
		getText,
		mapResultItem
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
							const tone = category.color || settingAccent;

							const openDetails = () => {
								openLibraryDetails('category', category.slug, title);
							};

							return (
								<HStack
									key={category.slug}
									spacing={12}
									modifiers={[
										padding({ vertical: 6, horizontal: 0 }),
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
									<ZStack>
										<Circle modifiers={[frame({ width: 36, height: 36 }), foregroundStyle(withAlpha(tone, 0.2))]} />
										<Text modifiers={[font({ size: 18 })]}>{category.emoji ?? '•'}</Text>
									</ZStack>

									<VStack alignment="leading" spacing={2}>
										<Text
											modifiers={[
												font({ size: 16, design: 'rounded', weight: 'semibold' }),
												foregroundStyle(theme.text.primary),
												lineLimit(1)
											]}
										>
											{title}
										</Text>
										<Text
											modifiers={[
												font({ size: 13, design: 'rounded' }),
												foregroundStyle(theme.text.secondary),
												lineLimit(1)
											]}
										>
											{category.slug}
										</Text>
									</VStack>

									<Spacer />
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
