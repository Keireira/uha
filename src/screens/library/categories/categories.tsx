import React, { useState } from 'react';
import { Stack, useRouter } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { useTheme } from 'styled-components/native';
import { useFuzzySearchList } from '@nozbe/microfuzz/react';

import { useAccent } from '@hooks';

import db from '@db';
import { asc, eq, sql } from 'drizzle-orm';
import { useLiveQuery } from 'drizzle-orm/expo-sqlite';
import { categoriesTable, subscriptionsTable } from '@db/schema';

import { openLibraryDetails } from '../common';

import {
	font,
	padding,
	listStyle,
	onTapGesture,
	listRowSeparator,
	listRowBackground,
	scrollTargetBehavior,
	scrollDismissesKeyboard,
	scrollContentBackground
} from '@expo/ui/swift-ui/modifiers';
import Toast from 'react-native-toast-message';
import { swipeActions } from '@modules/expo-ui-modifiers';
import { Host, Text, HStack, List, Section, Spacer } from '@expo/ui/swift-ui';

import type { CategoryT } from '@models';
import type { TextInputChangeEvent } from 'react-native';

const mapResultItem = ({ item }: { item: CategoryT }) => item;

const Categories = () => {
	const theme = useTheme();
	const router = useRouter();
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

		await db.delete(categoriesTable).where(eq(categoriesTable.slug, slug));
	};

	return (
		<>
			<Stack.Toolbar placement="left">
				<Stack.Toolbar.Button
					variant="plain"
					icon="chevron.backward"
					accessibilityLabel="Go back"
					onPress={() => router.replace('/(tabs)/library')}
					tintColor={settingAccent}
				/>
			</Stack.Toolbar>

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
							const title = category.title ?? t(`category.${category.slug}`, { defaultValue: category.title });

							const openDetails = () => {
								openLibraryDetails('category', category.slug, title);
							};

							return (
								<HStack
									key={category.slug}
									spacing={14}
									modifiers={[
										padding({ vertical: 8, horizontal: 0 }),
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
									<Text modifiers={[font({ size: 20, design: 'rounded', weight: 'regular' })]}>
										{category.emoji ? `${category.emoji} ${title}` : title}
									</Text>
									<Spacer />
									<Text modifiers={[font({ size: 15, design: 'rounded' })]}>{category.color ?? ''}</Text>
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
