import React from 'react';
import * as Haptics from 'expo-haptics';
import { useRouter } from 'expo-router';
import { asc } from 'drizzle-orm';
import { SymbolView } from 'expo-symbols';

import db from '@db';
import { tendersTable } from '@db/schema';
import { useLiveQuery } from 'drizzle-orm/expo-sqlite';

import { useAccent } from '@hooks';
import { useDraftStore } from '@screens/crossroad/add-subscription/hooks';

import Root, {
	Row,
	Emoji,
	Description,
	Title,
	Comment,
	Check,
	NoneRow,
	NoneTitle,
	CreateRow,
	CreateBadge,
	CreateTitle
} from './select-tender.styles';

const SelectTenderScreen = () => {
	const router = useRouter();
	const accent = useAccent();

	const selectedId = useDraftStore((state) => state.tender_id);
	const setTenderId = useDraftStore((state) => state.actions.setTenderId);

	const { data: tenders } = useLiveQuery(
		db.select().from(tendersTable).orderBy(asc(tendersTable.title)),
		[]
	);

	const handlePress = (id: string | null) => () => {
		Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
		setTenderId(id);
		router.back();
	};

	const handleCreate = () => {
		Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
		router.push('/(crossroad)/add-payment');
	};

	return (
		<Root showsVerticalScrollIndicator={false}>
			<CreateRow $accent={accent} onPress={handleCreate}>
				<CreateBadge $accent={accent}>
					<SymbolView name="plus" size={16} tintColor={accent} />
				</CreateBadge>
				<CreateTitle $accent={accent}>New Payment Method</CreateTitle>
			</CreateRow>

			<NoneRow onPress={handlePress(null)}>
				<NoneTitle>None</NoneTitle>
				{selectedId === null && <Check>✓</Check>}
			</NoneRow>

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
