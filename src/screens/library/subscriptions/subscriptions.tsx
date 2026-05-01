import React, { useState } from 'react';
import { asc, eq } from 'drizzle-orm';
import { Stack, useRouter } from 'expo-router';
import { useFuzzySearchList } from '@nozbe/microfuzz/react';
import { useLiveQuery } from 'drizzle-orm/expo-sqlite';

import { useAccent } from '@hooks';
import db from '@db';
import { categoriesTable, servicesTable, subscriptionsTable, tendersTable } from '@db/schema';

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

type SubscriptionRowT = {
	subscription: typeof subscriptionsTable.$inferSelect;
	service: typeof servicesTable.$inferSelect;
	category: typeof categoriesTable.$inferSelect | null;
	payment: typeof tendersTable.$inferSelect | null;
};

const getText = ({ subscription, service, category, payment }: SubscriptionRowT) => [
	subscription.custom_name ?? '',
	service.title,
	category?.title ?? '',
	payment?.title ?? ''
];
const mapResultItem = ({ item }: { item: SubscriptionRowT }) => item;

const Subscriptions = () => {
	const router = useRouter();
	const settingAccent = useAccent();
	const [searchQuery, setSearchQuery] = useState('');
	const { data = [] } = useLiveQuery(
		db
			.select({
				subscription: subscriptionsTable,
				service: servicesTable,
				category: categoriesTable,
				payment: tendersTable
			})
			.from(subscriptionsTable)
			.innerJoin(servicesTable, eq(subscriptionsTable.service_id, servicesTable.id))
			.leftJoin(categoriesTable, eq(subscriptionsTable.category_slug, categoriesTable.slug))
			.leftJoin(tendersTable, eq(subscriptionsTable.tender_id, tendersTable.id))
			.orderBy(asc(servicesTable.title))
	);
	const matches = useFuzzySearchList({
		list: data,
		queryText: searchQuery,
		getText,
		mapResultItem
	});

	const handleChangeText = (e: TextInputChangeEvent) => {
		setSearchQuery(e.nativeEvent.text.trim());
	};

	const subscriptions = searchQuery ? matches : data;

	return (
		<>
			<Stack.Toolbar placement="left">
				<Stack.Toolbar.Button
					variant="plain"
					icon="chevron.backward"
					accessibilityLabel="Go back"
					onPress={() => (router.canGoBack() ? router.back() : router.replace('/(tabs)/library'))}
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
						{subscriptions.map(({ subscription, service, payment }) => {
							const title = subscription.custom_name || service.title;
							return (
								<HStack
									key={subscription.id}
									spacing={14}
									modifiers={[
										padding({ vertical: 8, horizontal: 0 }),
										onTapGesture(() => openLibraryDetails('subscription', subscription.id, title))
									]}
								>
									<Text modifiers={[font({ size: 20, design: 'rounded', weight: 'regular' })]}>{title}</Text>
									<Spacer />
									<Text modifiers={[font({ size: 15, design: 'rounded' })]}>{payment?.title ?? ''}</Text>
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
					placeholder="Filter subscriptions"
				/>
			</Stack.Toolbar>
		</>
	);
};

export default Subscriptions;
