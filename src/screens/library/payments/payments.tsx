import React, { useState } from 'react';
import { asc } from 'drizzle-orm';
import { Stack, useRouter } from 'expo-router';
import { useFuzzySearchList } from '@nozbe/microfuzz/react';
import { useLiveQuery } from 'drizzle-orm/expo-sqlite';

import { useAccent } from '@hooks';
import db from '@db';
import { tendersTable } from '@db/schema';

import { openLibraryDetails } from '../common';

import {
	font,
	padding,
	listStyle,
	listRowSeparator,
	listRowBackground,
	onTapGesture,
	scrollTargetBehavior,
	scrollDismissesKeyboard,
	scrollContentBackground
} from '@expo/ui/swift-ui/modifiers';
import { Host, Text, HStack, List, Section, Spacer } from '@expo/ui/swift-ui';

import type { TextInputChangeEvent } from 'react-native';

type PaymentT = typeof tendersTable.$inferSelect;

const getText = (payment: PaymentT) => [payment.title, payment.comment ?? '', payment.emoji];
const mapResultItem = ({ item }: { item: PaymentT }) => item;

const Payments = () => {
	const router = useRouter();
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
										onTapGesture(() => openLibraryDetails('payment', payment.id, payment.title))
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
