import React, { useState } from 'react';
import { Stack } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { useTheme } from 'styled-components/native';
import { useFuzzySearchList } from '@nozbe/microfuzz/react';

import db from '@db';
import { asc, eq, sql } from 'drizzle-orm';
import { useLiveQuery } from 'drizzle-orm/expo-sqlite';
import { subscriptionsTable, tendersTable } from '@db/schema';

import { useAccent } from '@hooks';
import { openLibraryDetails } from '../shared';

import {
	font,
	frame,
	shapes,
	padding,
	listStyle,
	lineLimit,
	contentShape,
	onTapGesture,
	foregroundStyle,
	listRowSeparator,
	listRowBackground,
	scrollTargetBehavior,
	scrollDismissesKeyboard,
	scrollContentBackground
} from '@expo/ui/swift-ui/modifiers';
import { LogoView } from '@ui';
import Toast from 'react-native-toast-message';
import { swipeActions } from '@modules/expo-ui-modifiers';
import { Host, Text, VStack, HStack, RNHostView, List, Spacer, Section } from '@expo/ui/swift-ui';

import type { TenderT } from '@models';
import type { SFSymbol } from 'expo-symbols';
import type { TextInputChangeEvent } from 'react-native';

type MapResult = {
	item: TenderT;
};

const getText = (payment: TenderT) => {
	return [payment.title, payment.comment ?? '', payment.emoji];
};

const usePayments = (searchQuery = '') => {
	const { data = [] } = useLiveQuery(db.select().from(tendersTable).orderBy(asc(tendersTable.title)));

	const matches = useFuzzySearchList({
		list: data,
		queryText: searchQuery,
		getText,
		mapResultItem: ({ item }: MapResult) => item
	});

	return searchQuery ? matches : data;
};

const Payments = () => {
	const theme = useTheme();
	const { t } = useTranslation();
	const settingAccent = useAccent();
	const [searchQuery, setSearchQuery] = useState('');
	const payments = usePayments(searchQuery);

	const handleChangeText = (e: TextInputChangeEvent) => {
		setSearchQuery(e.nativeEvent.text.trim());
	};

	const deletePayment = (id: string) => async () => {
		const [{ count = 0 }] = await db
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
							const comment = payment.comment || (payment.is_card ? t('library.details.fields.card') : null);

							const openDetails = () => {
								openLibraryDetails('payment', payment.id, payment.title);
							};

							return (
								<HStack
									key={payment.id}
									spacing={16}
									modifiers={[
										contentShape(shapes.rectangle()),
										onTapGesture(openDetails),
										padding({ vertical: 6, horizontal: 0 }),
										frame({ maxWidth: Number.POSITIVE_INFINITY, alignment: 'leading' }),
										...swipeActions({
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
									<RNHostView matchContents>
										<LogoView
											key={`${payment.id}-icon`}
											symbolName={payment.symbol as SFSymbol}
											name={payment.title}
											emoji={payment.emoji}
											color={payment.color}
											url={payment.logo_url}
											size={48}
										/>
									</RNHostView>

									<VStack alignment="leading" spacing={4}>
										<Text
											modifiers={[
												font({ size: 20, design: 'rounded', weight: 'medium' }),
												foregroundStyle(theme.text.primary),
												lineLimit(1)
											]}
										>
											{payment.title}
										</Text>

										{Boolean(comment) && (
											<Text
												modifiers={[
													font({ size: 13, design: 'rounded' }),
													foregroundStyle(theme.text.secondary),
													lineLimit(1)
												]}
											>
												{comment}
											</Text>
										)}
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
