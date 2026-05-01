import React, { useState } from 'react';
import { Stack } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { useTheme } from 'styled-components/native';
import { useFuzzySearchList } from '@nozbe/microfuzz/react';

import db from '@db';
import { useAccent } from '@hooks';
import { withAlpha } from '@lib/colors';
import { asc, eq, sql } from 'drizzle-orm';
import { useLiveQuery } from 'drizzle-orm/expo-sqlite';
import { subscriptionsTable, tendersTable } from '@db/schema';

import { openLibraryDetails } from '../shared';

import {
	font,
	frame,
	padding,
	listStyle,
	lineLimit,
	onTapGesture,
	foregroundStyle,
	listRowSeparator,
	listRowBackground,
	scrollTargetBehavior,
	scrollDismissesKeyboard,
	scrollContentBackground
} from '@expo/ui/swift-ui/modifiers';
import Toast from 'react-native-toast-message';
import { swipeActions } from '@modules/expo-ui-modifiers';
import { Host, Text, HStack, VStack, ZStack, Circle, List, Section, Spacer } from '@expo/ui/swift-ui';

import type { TenderT } from '@models';
import type { TextInputChangeEvent } from 'react-native';

const getText = (payment: TenderT) => [payment.title, payment.comment ?? '', payment.emoji];
const mapResultItem = ({ item }: { item: TenderT }) => item;

const Payments = () => {
	const theme = useTheme();
	const { t } = useTranslation();
	const settingAccent = useAccent();
	const [searchQuery, setSearchQuery] = useState('');
	const { data = [] } = useLiveQuery(db.select().from(tendersTable).orderBy(asc(tendersTable.title)));
	const matches = useFuzzySearchList({
		list: data,
		queryText: searchQuery,
		getText,
		mapResultItem
	});

	const handleChangeText = (e: TextInputChangeEvent) => {
		setSearchQuery(e.nativeEvent.text.trim());
	};

	const payments = searchQuery ? matches : data;

	const deletePayment = (id: string) => async () => {
		const [{ count = 0 } = {}] = await db
			.select({ count: sql<number>`count(*)`.mapWith(Number) })
			.from(subscriptionsTable)
			.where(eq(subscriptionsTable.tender_id, id));

		if (count > 0) {
			Toast.show({
				type: 'error',
				text1: t('library.delete_blocked.title'),
				text2: t('library.delete_blocked.payment', { count })
			});
			return;
		}

		await db.delete(tendersTable).where(eq(tendersTable.id, id));
	};

	return (
		<>
			<Host style={{ flex: 1 }}>
				<List
					modifiers={[
						listStyle('insetGrouped'),
						scrollDismissesKeyboard('immediately'),
						scrollTargetBehavior('viewAligned'),
						scrollContentBackground('hidden')
					]}
				>
					<Section modifiers={[listRowSeparator('hidden', 'all'), listRowBackground('transparent')]}>
						{payments.map((payment) => {
							const tone = payment.color || settingAccent;
							const subtitle = payment.comment?.trim() || (payment.is_card ? t('library.details.fields.card') : '');

							return (
								<HStack
									key={payment.id}
									spacing={12}
									modifiers={[
										padding({ vertical: 6, horizontal: 0 }),
										onTapGesture(() => openLibraryDetails('payment', payment.id, payment.title)),
										swipeActions({
											actions: [
												{
													id: 'delete',
													systemImage: 'trash',
													tint: theme.semantic.error,
													onPress: deletePayment(payment.id)
												}
											]
										})
									]}
								>
									<ZStack>
										<Circle modifiers={[frame({ width: 36, height: 36 }), foregroundStyle(withAlpha(tone, 0.2))]} />
										<Text modifiers={[font({ size: 18 })]}>{payment.emoji}</Text>
									</ZStack>

									<VStack alignment="leading" spacing={2}>
										<Text
											modifiers={[
												font({ size: 16, design: 'rounded', weight: 'semibold' }),
												foregroundStyle(theme.text.primary),
												lineLimit(1)
											]}
										>
											{payment.title}
										</Text>
										{subtitle ? (
											<Text
												modifiers={[
													font({ size: 13, design: 'rounded' }),
													foregroundStyle(theme.text.secondary),
													lineLimit(1)
												]}
											>
												{subtitle}
											</Text>
										) : null}
									</VStack>

									<Spacer />
								</HStack>
							);
						})}
					</Section>
				</List>
			</Host>

			<Stack.Toolbar placement="bottom">
				<Stack.SearchBar
					autoFocus={false}
					inputType="text"
					autoCapitalize="none"
					placement="integratedButton"
					hideNavigationBar={false}
					onChangeText={handleChangeText}
					tintColor={settingAccent}
					placeholder="Filter payment methods"
				/>
			</Stack.Toolbar>
		</>
	);
};

export default Payments;
