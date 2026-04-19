import { useState } from 'react';
import { useRouter } from 'expo-router';
import * as Crypto from 'expo-crypto';
import * as Haptics from 'expo-haptics';

import db from '@db';
import { tendersTable } from '@db/schema';

import { useDraftStore } from '@screens/crossroad/add-subscription/hooks';

const useAddPayment = () => {
	const router = useRouter();
	const setTenderId = useDraftStore((state) => state.actions.setTenderId);

	const [title, setTitle] = useState('');
	const [emoji, setEmoji] = useState('');
	const [color, setColor] = useState('#1A1F71');
	const [isCard, setIsCard] = useState(true);
	const [comment, setComment] = useState('');

	const isValid = title.trim().length > 0 && emoji.length > 0 && color.length > 0;

	const save = async () => {
		if (!isValid) return;

		const id = Crypto.randomUUID();

		await db.insert(tendersTable).values({
			id,
			title: title.trim(),
			emoji,
			color,
			is_card: isCard,
			comment: comment.trim() || ''
		});

		Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
		setTenderId(id);

		router.back();
	};

	return { title, setTitle, emoji, setEmoji, color, setColor, isCard, setIsCard, comment, setComment, isValid, save };
};

export default useAddPayment;
