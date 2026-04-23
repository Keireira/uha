import React from 'react';
import * as Haptics from 'expo-haptics';
import { Stack, useRouter } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { asc } from 'drizzle-orm';

import db from '@db';
import { categoriesTable } from '@db/schema';
import { useLiveQuery } from 'drizzle-orm/expo-sqlite';

import { useAccent } from '@hooks';
import { useDraftStore } from '@screens/crossroad/add-subscription/hooks';

import Root, { Row, Emoji, Title, Check } from './select-category.styles';

const SelectCategoryScreen = () => {
	const router = useRouter();
	const accent = useAccent();
	const { t } = useTranslation();

	const selectedSlug = useDraftStore((state) => state.category_slug);
	const setCategorySlug = useDraftStore((state) => state.actions.setCategorySlug);

	const { data: categories } = useLiveQuery(db.select().from(categoriesTable).orderBy(asc(categoriesTable.title)), []);

	const handlePress = (slug: string) => () => {
		Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
		setCategorySlug(slug);
		router.back();
	};

	const handleCreate = () => {
		Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
		router.push('/(crossroad)/add-category');
	};

	const confirm = () => {
		router.back();
	};

	return (
		<Root showsVerticalScrollIndicator={false}>
			<Stack.Toolbar placement="left">
				<Stack.Toolbar.Button
					variant="plain"
					icon="plus"
					accessibilityHint="Create new category"
					onPress={handleCreate}
					tintColor={accent}
				/>
			</Stack.Toolbar>

			<Stack.Toolbar placement="right">
				<Stack.Toolbar.Button
					variant="done"
					icon="checkmark"
					accessibilityHint="Close the picker"
					onPress={confirm}
					tintColor={accent}
				/>
			</Stack.Toolbar>

			{categories.map((category) => {
				const isActive = category.slug === selectedSlug;
				const localized = t(`category.${category.slug}`, { defaultValue: category.title });

				return (
					<Row key={category.slug} onPress={handlePress(category.slug)}>
						<Emoji $color={category.color ?? '#888'}>{category.emoji ?? '•'}</Emoji>
						<Title>{localized}</Title>
						{isActive && <Check>✓</Check>}
					</Row>
				);
			})}
		</Root>
	);
};

export default SelectCategoryScreen;
