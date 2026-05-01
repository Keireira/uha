import React, { useState } from 'react';
import { Stack, useRouter } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { useTheme } from 'styled-components/native';
import { useFuzzySearchList } from '@nozbe/microfuzz/react';

import db from '@db';
import { useAccent } from '@hooks';
import { asc, eq, sql } from 'drizzle-orm';
import { useLiveQuery } from 'drizzle-orm/expo-sqlite';
import { subscriptionsTable, tendersTable } from '@db/schema';

import { openLibraryDetails } from '../common';

import {
	font,
	padding,
	listStyle,
	onTapGesture,
	listRowSeparator,
	listRowBackground,
	scrollTargetBehavior,
	scrollDismissesKeyboard,
	scrollContentBackground
} from '@expo/ui/swift-ui/modifiers';
import Toast from 'react-native-toast-message';
import { swipeActions } from '@modules/expo-ui-modifiers';
import { Host, Text, HStack, List, Section, Spacer } from '@expo/ui/swift-ui';

import type { TenderT } from '@models';
import type { TextInputChangeEvent } from 'react-native';

const getText = (payment: TenderT) => [payment.title, payment.comment ?? '', payment.emoji];
const mapResultItem = ({ item }: { item: TenderT }) => item;

const Payments = () => {
	const theme = useTheme();
	const router = useRouter();
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
			<Stack.Toolbar placement="left">
				<Stack.Toolbar.Button
					variant="plain"
					icon="chevron.backward"
					accessibilityLabel="Go back"
					onPress={() => router.replace('/(tabs)/library')}
					tintColor={settingAccent}
				/>
			</Stack.Toolbar>

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
							return (
								<HStack
									key={payment.id}
									spacing={14}
									modifiers={[
										padding({ vertical: 8, horizontal: 0 }),
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
									<Text modifiers={[font({ size: 20, design: 'rounded', weight: 'regular' })]}>
										{payment.emoji} {payment.title}
									</Text>
									<Spacer />
									<Text modifiers={[font({ size: 15, design: 'rounded' })]}>{payment.comment ?? ''}</Text>
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
