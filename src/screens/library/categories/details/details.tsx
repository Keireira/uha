import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useTheme } from 'styled-components/native';
import { Stack, useLocalSearchParams, useRouter } from 'expo-router';

import db from '@db';
import { eq } from 'drizzle-orm';
import { useLiveQuery } from 'drizzle-orm/expo-sqlite';
import { categoriesTable, subscriptionsTable } from '@db/schema';

import { useAccent } from '@hooks';

import {
	font,
	listStyle,
	foregroundStyle,
	onLongPressGesture,
	multilineTextAlignment,
	scrollDismissesKeyboard
} from '@expo/ui/swift-ui/modifiers';
import { Host, Text, List, Section, TextField, ColorPicker, LabeledContent } from '@expo/ui/swift-ui';

type LocalSearchParams = {
	id: string;
	title: string;
	type: 'category';
};

const CategoryDetails = () => {
	const theme = useTheme();
	const router = useRouter();
	const { t } = useTranslation();
	const settingAccent = useAccent();
	const { id } = useLocalSearchParams<LocalSearchParams>();

	const {
		data: [category]
	} = useLiveQuery(db.select().from(categoriesTable).where(eq(categoriesTable.slug, id)).limit(1), [id]);

	const [slug, setSlug] = useState('');
	const [title, setTitle] = useState('');
	const [emoji, setEmoji] = useState('');
	const [color, setColor] = useState('');
	const [isSlugEditable, setIsSlugEditable] = useState(false);

	useEffect(() => {
		if (!category) return;

		setSlug(category.slug);
		setTitle(category.title ?? '');
		setEmoji(category.emoji ?? '');
		setColor(category.color ?? '');
	}, [category]);

	const enableSlugEdit = () => setIsSlugEditable(true);

	const save = async () => {
		if (!category) return;

		const nextSlug = slug.trim();
		if (!nextSlug) return;

		const nextTitle = title.trim() || null;
		const nextEmoji = emoji.trim() || null;
		const nextColor = color.trim() || null;

		try {
			if (nextSlug !== category.slug) {
				await db.transaction(async (tx) => {
					await tx
						.update(subscriptionsTable)
						.set({ category_slug: nextSlug })
						.where(eq(subscriptionsTable.category_slug, category.slug));

					await tx
						.update(categoriesTable)
						.set({ slug: nextSlug, title: nextTitle, emoji: nextEmoji, color: nextColor })
						.where(eq(categoriesTable.slug, category.slug));
				});
			} else {
				await db
					.update(categoriesTable)
					.set({ title: nextTitle, emoji: nextEmoji, color: nextColor })
					.where(eq(categoriesTable.slug, category.slug));
			}

			router.back();
		} catch (err) {
			console.warn('[category-details] save failed:', err);
		}
	};

	if (!category?.slug) return null;

	const labelMods = [font({ size: 16, weight: 'regular' })];
	const valueMods = [
		multilineTextAlignment('trailing'),
		foregroundStyle(theme.text.secondary),
		font({ size: 16, weight: 'regular' })
	];

	return (
		<>
			<Stack.Screen options={{ title: t(`category.${category.slug}`, { defaultValue: category.title }) }} />

			<Stack.Toolbar placement="right">
				<Stack.Toolbar.Button variant="done" icon="checkmark" onPress={save} tintColor={settingAccent} />
			</Stack.Toolbar>

			<Host style={{ flex: 1 }}>
				<List modifiers={[listStyle('insetGrouped'), scrollDismissesKeyboard('immediately')]}>
					<Section title={t('library.details.section.identity')}>
						{isSlugEditable ? (
							<LabeledContent label={t('library.details.fields.slug')}>
								<TextField
									autoFocus
									defaultValue={category?.slug ?? ''}
									placeholder="slug"
									onValueChange={setSlug}
									modifiers={valueMods}
								/>
							</LabeledContent>
						) : (
							<LabeledContent label={t('library.details.fields.slug')} modifiers={[onLongPressGesture(enableSlugEdit)]}>
								<Text modifiers={valueMods}>{slug}</Text>
							</LabeledContent>
						)}

						<LabeledContent label={t('library.details.fields.title')} modifiers={labelMods}>
							<TextField
								defaultValue={category?.title ?? ''}
								placeholder="Override current one"
								onValueChange={setTitle}
								modifiers={valueMods}
							/>
						</LabeledContent>
					</Section>

					<Section title={t('library.details.section.appearance')}>
						<LabeledContent label={t('library.details.fields.emoji')} modifiers={labelMods}>
							<TextField
								defaultValue={category?.emoji ?? ''}
								placeholder="One emoji to symbolize"
								onValueChange={(v) => setEmoji(v.slice(-8))}
								modifiers={valueMods}
							/>
						</LabeledContent>

						<ColorPicker
							label={t('library.details.fields.color')}
							selection={color || null}
							onSelectionChange={setColor}
							supportsOpacity={false}
						/>
					</Section>
				</List>
			</Host>
		</>
	);
};

export default CategoryDetails;
