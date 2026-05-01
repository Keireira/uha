import React, { useState } from 'react';
import { Stack, useRouter } from 'expo-router';
import { useFuzzySearchList } from '@nozbe/microfuzz/react';

import db from '@db';
import { asc, eq } from 'drizzle-orm';
import { useAccent, useSettingsValue } from '@hooks';
import { useLiveQuery } from 'drizzle-orm/expo-sqlite';
import { categoriesTable, servicesTable, subscriptionsTable, tendersTable, timelineEventsTable } from '@db/schema';

import { openLibraryDetails } from '../common';
import { regenerateAllTxs } from '@hooks/setup';

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
import { swipeActions } from '@modules/swipe-actions';
import { Host, Text, HStack, List, Section, Spacer } from '@expo/ui/swift-ui';

import type { TextInputChangeEvent } from 'react-native';
import type { SubscriptionT, ServiceT, CategoryT, TenderT } from '@models';

type SubscriptionRowT = {
	subscription: SubscriptionT;
	service: ServiceT;
	category: CategoryT | null;
	payment: TenderT | null;
};

type ResultItemT = {
	item: SubscriptionRowT;
};

const mapResultItem = ({ item }: ResultItemT) => item;
const getText = ({ subscription, service, category, payment }: SubscriptionRowT) => [
	subscription.custom_name ?? '',
	category?.title ?? '',
	payment?.title ?? '',
	service.title
];

const Subscriptions = () => {
	const router = useRouter();
	const settingAccent = useAccent();
	const [searchQuery, setSearchQuery] = useState('');
	const maxHorizon = useSettingsValue<number>('max_horizon');

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

	const deleteSubscription = (id: string) => async () => {
		await db.delete(timelineEventsTable).where(eq(timelineEventsTable.subscription_id, id));
		await db.delete(subscriptionsTable).where(eq(subscriptionsTable.id, id));

		const horizonYears = typeof maxHorizon === 'number' && Number.isFinite(maxHorizon) ? maxHorizon : 2;
		await regenerateAllTxs(horizonYears);
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
						{subscriptions.map(({ subscription, service, payment }) => {
							const title = subscription.custom_name || service.title;
							return (
								<HStack
									key={subscription.id}
									spacing={14}
									modifiers={[
										padding({ vertical: 8, horizontal: 0 }),
										onTapGesture(() => openLibraryDetails('subscription', subscription.id, title)),
										swipeActions({
											actions: [
												{
													id: 'delete',
													systemImage: 'trash',
													role: 'destructive',
													onPress: deleteSubscription(subscription.id)
												}
											]
										})
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
