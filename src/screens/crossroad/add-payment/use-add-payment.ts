import { useState } from 'react';
import { useRouter } from 'expo-router';
import * as Crypto from 'expo-crypto';

import db from '@db';
import { tendersTable } from '@db/schema';

const useAddPayment = () => {
	const router = useRouter();

	const [title, setTitle] = useState('');
	const [emoji, setEmoji] = useState('');
	const [color, setColor] = useState('#f3a683');
	const [isCard, setIsCard] = useState(true);
	const [comment, setComment] = useState('');

	const isValid = title.trim().length > 0 && emoji.length > 0 && color.length > 0;

	const save = async () => {
		if (!isValid) return;

		await db.insert(tendersTable).values({
			id: Crypto.randomUUID(),
			title: title.trim(),
			emoji,
			color,
			is_card: isCard,
			comment: comment.trim() || ''
		});

		router.back();
	};

	return { title, setTitle, emoji, setEmoji, color, setColor, isCard, setIsCard, comment, setComment, isValid, save };
};

export default useAddPayment;
