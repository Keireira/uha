import React, { useEffect, useState } from 'react';
import { eq } from 'drizzle-orm';
import { Stack, useLocalSearchParams } from 'expo-router';
import { useLiveQuery } from 'drizzle-orm/expo-sqlite';

import { useAccent } from '@hooks';
import db from '@db';
import { categoriesTable } from '@db/schema';

import { normalizeOptional } from '../../common';

import { listStyle, scrollDismissesKeyboard } from '@expo/ui/swift-ui/modifiers';
import { Host, List, Section, TextField, Button } from '@expo/ui/swift-ui';

const CategoryDetails = () => {
	const { id } = useLocalSearchParams<{ id: string }>();
	const settingAccent = useAccent();
	const { data } = useLiveQuery(db.select().from(categoriesTable).where(eq(categoriesTable.slug, id)).limit(1), [id]);
	const category = data?.[0];

	const [title, setTitle] = useState('');
	const [emoji, setEmoji] = useState('');
	const [color, setColor] = useState('');

	useEffect(() => {
		if (!category) return;
		setTitle(category.title ?? '');
		setEmoji(category.emoji ?? '');
		setColor(category.color ?? '');
	}, [category]);

	const save = async () => {
		if (!category) return;

		await db
			.update(categoriesTable)
			.set({
				title: normalizeOptional(title),
				emoji: normalizeOptional(emoji),
				color: normalizeOptional(color)
			})
			.where(eq(categoriesTable.slug, category.slug));
	};

	return (
		<>
			<Stack.Toolbar placement="right">
				<Stack.Toolbar.Button variant="done" icon="checkmark" onPress={save} tintColor={settingAccent} />
			</Stack.Toolbar>
			<Host style={{ flex: 1 }}>
				<List modifiers={[listStyle('insetGrouped'), scrollDismissesKeyboard('immediately')]}>
					<Section title="Category">
						<TextField
							key={`title-${category?.slug ?? 'new'}`}
							defaultValue={category?.title ?? title}
							placeholder="Title"
							onValueChange={setTitle}
						/>
						<TextField
							key={`emoji-${category?.slug ?? 'new'}`}
							defaultValue={category?.emoji ?? emoji}
							placeholder="Emoji"
							onValueChange={setEmoji}
						/>
						<TextField
							key={`color-${category?.slug ?? 'new'}`}
							defaultValue={category?.color ?? color}
							placeholder="Color"
							onValueChange={setColor}
						/>
					</Section>
					<Section>
						<Button label="Save" onPress={save} />
					</Section>
				</List>
			</Host>
		</>
	);
};

export default CategoryDetails;
