import React, { useState } from 'react';
import { Stack } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { useTheme } from 'styled-components/native';
import { useFuzzySearchList } from '@nozbe/microfuzz/react';

import db from '@db';
import { asc, eq } from 'drizzle-orm';
import { useAccent, useSettingsValue } from '@hooks';
import { withAlpha } from '@lib/colors';
import { useLiveQuery } from 'drizzle-orm/expo-sqlite';
import { categoriesTable, servicesTable, subscriptionsTable, tendersTable, timelineEventsTable } from '@db/schema';

import { openLibraryDetails } from '../shared';
import { regenerateAllTxs } from '@hooks/setup';

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
import { swipeActions } from '@modules/expo-ui-modifiers';
import { Host, Text, HStack, VStack, ZStack, Image, Circle, List, Section, Spacer } from '@expo/ui/swift-ui';

import type { SFSymbol } from 'expo-symbols';
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
	const theme = useTheme();
	const { t } = useTranslation();
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
						{subscriptions.map(({ subscription, service, category, payment }) => {
							const title = subscription.custom_name || service.title;
							const tone = service.color || settingAccent;
							const subtitle =
								payment?.title ??
								(category && t(`category.${category.slug}`, { defaultValue: category.title ?? category.slug })) ??
								'';

							return (
								<HStack
									key={subscription.id}
									spacing={12}
									modifiers={[
										padding({ vertical: 6, horizontal: 0 }),
										onTapGesture(() => openLibraryDetails('subscription', subscription.id, title)),
										swipeActions({
											actions: [
												{
													id: 'delete',
													systemImage: 'trash',
													tint: theme.semantic.error,
													onPress: deleteSubscription(subscription.id)
												}
											]
										})
									]}
								>
									<ZStack>
										<Circle modifiers={[frame({ width: 36, height: 36 }), foregroundStyle(withAlpha(tone, 0.2))]} />
										{service.symbol ? (
											<Image systemName={service.symbol as SFSymbol} size={16} color={tone} />
										) : (
											<Text modifiers={[font({ size: 18 })]}>{category?.emoji ?? '•'}</Text>
										)}
									</ZStack>

									<VStack alignment="leading" spacing={2}>
										<Text
											modifiers={[
												font({ size: 16, design: 'rounded', weight: 'semibold' }),
												foregroundStyle(theme.text.primary),
												lineLimit(1)
											]}
										>
											{title}
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
					placeholder="Filter subscriptions"
				/>
			</Stack.Toolbar>
		</>
	);
};

export default Subscriptions;
