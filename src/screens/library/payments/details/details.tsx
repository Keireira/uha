import React, { useEffect, useState } from 'react';
import { eq } from 'drizzle-orm';
import { Stack, useLocalSearchParams } from 'expo-router';
import { useLiveQuery } from 'drizzle-orm/expo-sqlite';

import { useAccent } from '@hooks';
import db from '@db';
import { tendersTable } from '@db/schema';

import { listStyle, scrollDismissesKeyboard } from '@expo/ui/swift-ui/modifiers';
import { Host, List, Section, TextField, Toggle, Button } from '@expo/ui/swift-ui';

const PaymentDetails = () => {
	const { id } = useLocalSearchParams<{ id: string }>();
	const settingAccent = useAccent();
	const { data } = useLiveQuery(db.select().from(tendersTable).where(eq(tendersTable.id, id)).limit(1), [id]);
	const payment = data?.[0];

	const [title, setTitle] = useState('');
	const [emoji, setEmoji] = useState('');
	const [color, setColor] = useState('');
	const [comment, setComment] = useState('');
	const [isCard, setIsCard] = useState(true);

	useEffect(() => {
		if (!payment) return;
		setTitle(payment.title);
		setEmoji(payment.emoji);
		setColor(payment.color);
		setComment(payment.comment ?? '');
		setIsCard(payment.is_card);
	}, [payment]);

	const save = async () => {
		if (!payment || !title.trim() || !emoji.trim() || !color.trim()) return;

		await db
			.update(tendersTable)
			.set({
				title: title.trim(),
				emoji: emoji.trim(),
				color: color.trim(),
				comment: comment.trim(),
				is_card: isCard
			})
			.where(eq(tendersTable.id, payment.id));
	};

	return (
		<>
			<Stack.Toolbar placement="right">
				<Stack.Toolbar.Button variant="done" icon="checkmark" onPress={save} tintColor={settingAccent} />
			</Stack.Toolbar>
			<Host style={{ flex: 1 }}>
				<List modifiers={[listStyle('insetGrouped'), scrollDismissesKeyboard('immediately')]}>
					<Section title="Payment Method">
						<TextField
							key={`title-${payment?.id ?? 'new'}`}
							defaultValue={payment?.title ?? title}
							placeholder="Title"
							onValueChange={setTitle}
						/>
						<TextField
							key={`emoji-${payment?.id ?? 'new'}`}
							defaultValue={payment?.emoji ?? emoji}
							placeholder="Emoji"
							onValueChange={setEmoji}
						/>
						<TextField
							key={`color-${payment?.id ?? 'new'}`}
							defaultValue={payment?.color ?? color}
							placeholder="Color"
							onValueChange={setColor}
						/>
						<TextField
							key={`comment-${payment?.id ?? 'new'}`}
							defaultValue={payment?.comment ?? comment}
							placeholder="Comment"
							onValueChange={setComment}
						/>
						<Toggle isOn={isCard} label="Card" onIsOnChange={setIsCard} />
					</Section>
					<Section>
						<Button label="Save" onPress={save} />
					</Section>
				</List>
			</Host>
		</>
	);
};

export default PaymentDetails;
