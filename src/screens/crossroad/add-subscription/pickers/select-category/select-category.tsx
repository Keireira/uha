import React from 'react';
import * as Haptics from 'expo-haptics';
import { useRouter } from 'expo-router';
import { asc } from 'drizzle-orm';
import { SymbolView } from 'expo-symbols';

import db from '@db';
import { categoriesTable } from '@db/schema';
import { useLiveQuery } from 'drizzle-orm/expo-sqlite';

import { useAccent } from '@hooks';
import { useDraftStore } from '@screens/crossroad/add-subscription/hooks';

import Root, { Row, CreateRow, CreateBadge, CreateTitle, Emoji, Title, Check } from './select-category.styles';

const SelectCategoryScreen = () => {
	const router = useRouter();
	const accent = useAccent();

	const selectedSlug = useDraftStore((state) => state.category_slug);
	const setCategorySlug = useDraftStore((state) => state.actions.setCategorySlug);

	const { data: categories } = useLiveQuery(
		db.select().from(categoriesTable).orderBy(asc(categoriesTable.title)),
		[]
	);

	const handlePress = (slug: string) => () => {
		Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
		setCategorySlug(slug);
		router.back();
	};

	const handleCreate = () => {
		Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
		router.push('/(crossroad)/add-category');
	};

	return (
		<Root showsVerticalScrollIndicator={false}>
			<CreateRow $accent={accent} onPress={handleCreate}>
				<CreateBadge $accent={accent}>
					<SymbolView name="plus" size={16} tintColor={accent} />
				</CreateBadge>
				<CreateTitle $accent={accent}>New Category</CreateTitle>
			</CreateRow>

			{categories.map((category) => {
				const isActive = category.slug === selectedSlug;

				return (
					<Row key={category.slug} onPress={handlePress(category.slug)}>
						<Emoji $color={category.color ?? '#888'}>{category.emoji ?? '•'}</Emoji>
						<Title>{category.title ?? category.slug}</Title>
						{isActive && <Check>✓</Check>}
					</Row>
				);
			})}
		</Root>
	);
};

export default SelectCategoryScreen;
