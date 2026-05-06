import React, { useState } from 'react';
import { Stack } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { useTheme } from 'styled-components/native';
import { useFuzzySearchList } from '@nozbe/microfuzz/react';

import db from '@db';
import { asc, eq } from 'drizzle-orm';
import { useLiveQuery } from 'drizzle-orm/expo-sqlite';
import { servicesTable, subscriptionsTable, timelineEventsTable } from '@db/schema';

import { openLibraryDetails } from '../shared';
import { regenerateAllTxs } from '@hooks/setup';
import { useAccent, useSettingsValue } from '@hooks';
import { removeNotificationsFor } from '@lib/notifications';

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
import { swipeActions } from '@modules/expo-ui-modifiers';
import { Host, Text, HStack, VStack, List, Spacer, Section, RNHostView } from '@expo/ui/swift-ui';

import type { SFSymbol } from 'expo-symbols';
import type { SubscriptionT, ServiceT } from '@models';
import type { TextInputChangeEvent } from 'react-native';

type SubscriptionRowT = {
	subscription: SubscriptionT;
	service: ServiceT;
};

type ResultItemT = {
	item: SubscriptionRowT;
};

const getText = ({ subscription, service }: SubscriptionRowT) => [subscription.custom_name ?? '', service.title];

const useSubscriptions = (searchQuery = '') => {
	const { data = [] } = useLiveQuery(
		db
			.select({
				subscription: subscriptionsTable,
				service: servicesTable
			})
			.from(subscriptionsTable)
			.innerJoin(servicesTable, eq(subscriptionsTable.service_id, servicesTable.id))
			.orderBy(asc(servicesTable.title))
	);

	const matches = useFuzzySearchList({
		list: data,
		queryText: searchQuery,
		getText,
		mapResultItem: ({ item }: ResultItemT) => item
	});

	return searchQuery ? matches : data;
};

const Subscriptions = () => {
	const theme = useTheme();
	const { t } = useTranslation();
	const settingAccent = useAccent();
	const [searchQuery, setSearchQuery] = useState('');
	const subscriptions = useSubscriptions(searchQuery);
	const maxHorizon = useSettingsValue<number>('max_horizon');

	const handleChangeText = (e: TextInputChangeEvent) => {
		setSearchQuery(e.nativeEvent.text.trim());
	};

	const deleteSubscription = (id: string) => async () => {
		await removeNotificationsFor(id)();
		await db.delete(timelineEventsTable).where(eq(timelineEventsTable.subscription_id, id));
		await db.delete(subscriptionsTable).where(eq(subscriptionsTable.id, id));

		await regenerateAllTxs(maxHorizon);
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
						{subscriptions.map(({ subscription, service }) => {
							const title = subscription.custom_name || service.title;
							const subtitle = t(`category.${subscription.category_slug}`, {
								defaultValue: subscription.category_slug
							});

							const openDetails = () => {
								openLibraryDetails('subscription', subscription.id, title);
							};

							return (
								<HStack
									key={subscription.id}
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
													onPress: deleteSubscription(subscription.id)
												}
											]
										})
									]}
								>
									<RNHostView matchContents>
										<LogoView
											key={`${service.id}-icon`}
											url={subscription.custom_logo ?? service.logo_url}
											symbolName={(subscription.custom_symbol ?? service.symbol) as SFSymbol}
											name={title}
											color={service.color}
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
											{title}
										</Text>

										{Boolean(subtitle) && (
											<Text
												modifiers={[
													font({ size: 16, weight: 'regular', design: 'rounded' }),
													foregroundStyle(theme.text.secondary),
													lineLimit(1)
												]}
											>
												{subtitle}
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
					placeholder={t('library.filters.subscriptions')}
				/>
			</Stack.Toolbar>
		</>
	);
};

export default Subscriptions;
