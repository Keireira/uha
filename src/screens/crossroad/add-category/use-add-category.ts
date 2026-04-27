import { useState } from 'react';
import { useRouter } from 'expo-router';
import * as Haptics from 'expo-haptics';

import db from '@db';
import { categoriesTable } from '@db/schema';

import { useDraftStore } from '@screens/crossroad/add-subscription/hooks';

const slugify = (s: string) =>
	s
		.trim()
		.toLowerCase()
		.replace(/[^a-z0-9]+/g, '_')
		.replace(/^_+|_+$/g, '');

const useAddCategory = () => {
	const router = useRouter();
	const setCategorySlug = useDraftStore((state) => state.actions.setCategorySlug);

	const [title, setTitle] = useState('');
	const [emoji, setEmoji] = useState('');
	const [color, setColor] = useState('#FF6B35');

	const isValid = title.trim().length > 0 && emoji.length > 0 && color.length > 0;

	const save = async () => {
		if (!isValid) return;

		const slug = slugify(title) || `cat_${Date.now()}`;

		await db.insert(categoriesTable).values({
			slug,
			title: title.trim(),
			emoji,
			color
		});

		Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
		setCategorySlug(slug);

		router.back();
	};

	return { title, setTitle, emoji, setEmoji, color, setColor, isValid, save };
};

export default useAddCategory;
