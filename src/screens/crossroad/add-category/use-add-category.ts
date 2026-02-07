import { useState } from 'react';
import { useRouter } from 'expo-router';
import * as Crypto from 'expo-crypto';

import db from '@db';
import { categoriesTable } from '@db/schema';

const useAddCategory = () => {
	const router = useRouter();

	const [title, setTitle] = useState('');
	const [emoji, setEmoji] = useState('');
	const [color, setColor] = useState('#ff9f0a');
	const [showEmojiPicker, setShowEmojiPicker] = useState(false);
	const [showColorPicker, setShowColorPicker] = useState(false);

	const isValid = title.trim().length > 0 && emoji.length > 0 && color.length > 0;

	const save = async () => {
		if (!isValid) return;

		await db.insert(categoriesTable).values({
			id: Crypto.randomUUID(),
			title: title.trim(),
			emoji,
			color
		});

		router.back();
	};

	return {
		title,
		setTitle,
		emoji,
		setEmoji,
		color,
		setColor,
		showEmojiPicker,
		setShowEmojiPicker,
		showColorPicker,
		setShowColorPicker,
		isValid,
		save
	};
};

export default useAddCategory;
