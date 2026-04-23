import React from 'react';
import * as Haptics from 'expo-haptics';
import { asc } from 'drizzle-orm';
import { Stack, useRouter } from 'expo-router';

import db from '@db';
import { tendersTable } from '@db/schema';
import { useLiveQuery } from 'drizzle-orm/expo-sqlite';

import { useAccent } from '@hooks';
import { useDraftStore } from '@screens/crossroad/add-subscription/hooks';

import Root, { Row, Emoji, Description, Title, Comment, Check, NoneTitle } from './select-tender.styles';

const SelectTenderScreen = () => {
	const router = useRouter();
	const accent = useAccent();

	const selectedId = useDraftStore((state) => state.tender_id);
	const setTenderId = useDraftStore((state) => state.actions.setTenderId);

	const { data: tenders } = useLiveQuery(db.select().from(tendersTable).orderBy(asc(tendersTable.title)), []);

	const handlePress = (id: string | null) => () => {
		Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
		setTenderId(id);
		router.back();
	};

	const handleCreate = () => {
		Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
		router.push('/(crossroad)/add-payment');
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
					accessibilityHint="Create new payment method"
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

			<Row onPress={handlePress(null)}>
				<NoneTitle>None</NoneTitle>
				{selectedId === null && <Check>✓</Check>}
			</Row>

			{tenders.map((tender) => {
				const isActive = tender.id === selectedId;

				return (
					<Row key={tender.id} onPress={handlePress(tender.id)}>
						<Emoji $color={tender.color}>{tender.emoji}</Emoji>

						<Description>
							<Title>{tender.title}</Title>
							{!!tender.comment && <Comment>{tender.comment}</Comment>}
						</Description>

						{isActive && <Check>✓</Check>}
					</Row>
				);
			})}
		</Root>
	);
};

export default SelectTenderScreen;
