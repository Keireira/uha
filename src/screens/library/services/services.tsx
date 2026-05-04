import React, { useState } from 'react';
import { Stack } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { useTheme } from 'styled-components/native';
import { useFuzzySearchList } from '@nozbe/microfuzz/react';

import db from '@db';
import { asc, eq, sql } from 'drizzle-orm';
import { useLiveQuery } from 'drizzle-orm/expo-sqlite';
import { categoriesTable, servicesTable, subscriptionsTable } from '@db/schema';

import { useAccent } from '@hooks';
import { openLibraryDetails } from '../shared';

import {
	font,
	frame,
	shapes,
	padding,
	listStyle,
	lineLimit,
	onTapGesture,
	contentShape,
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
import { Host, Text, HStack, VStack, List, Spacer, Section, RNHostView } from '@expo/ui/swift-ui';

import type { SFSymbol } from 'expo-symbols';
import type { TextInputChangeEvent } from 'react-native';

type ServiceRowT = {
	service: typeof servicesTable.$inferSelect;
	category: typeof categoriesTable.$inferSelect | null;
};

type MapResult = {
	item: ServiceRowT;
};

const getText = ({ service, category }: ServiceRowT) => [
	service.title,
	service.slug ?? '',
	category?.title ?? '',
	...(service.aliases ?? [])
];

const useServices = (searchQuery = '') => {
	const { data = [] } = useLiveQuery(
		db
			.select({ service: servicesTable, category: categoriesTable })
			.from(servicesTable)
			.leftJoin(categoriesTable, eq(servicesTable.category_slug, categoriesTable.slug))
			.orderBy(asc(servicesTable.title))
	);

	const matches = useFuzzySearchList({
		list: data,
		queryText: searchQuery,
		getText,
		mapResultItem: ({ item }: MapResult) => item
	});

	return searchQuery ? matches : data;
};

const Services = () => {
	const theme = useTheme();
	const { t } = useTranslation();
	const settingAccent = useAccent();
	const [searchQuery, setSearchQuery] = useState('');
	const services = useServices(searchQuery);

	const handleChangeText = (e: TextInputChangeEvent) => {
		setSearchQuery(e.nativeEvent.text.trim());
	};

	const deleteService = (id: string) => async () => {
		const [{ count = 0 }] = await db
			.select({ count: sql<number>`count(*)`.mapWith(Number) })
			.from(subscriptionsTable)
			.where(eq(subscriptionsTable.service_id, id));

		if (count > 0) {
			Toast.show({
				type: 'error',
				text1: t('library.delete_blocked.title'),
				text2: t('library.delete_blocked.service', { count })
			});

			return;
		}

		await db.delete(servicesTable).where(eq(servicesTable.id, id));
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
						{services.map(({ service, category }) => {
							const categoryTitle = category
								? t(`category.${category.slug}`, { defaultValue: category.title ?? category.slug })
								: null;

							const openDetails = () => {
								openLibraryDetails('service', service.id, service.title);
							};

							return (
								<HStack
									key={service.id}
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
													onPress: deleteService(service.id)
												}
											]
										})
									]}
								>
									<RNHostView matchContents>
										<LogoView
											key={`${service.id}-icon`}
											url={service.logo_url}
											symbolName={service.symbol as SFSymbol}
											name={service.title}
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
											{service.title}
										</Text>

										{Boolean(categoryTitle) && (
											<Text
												modifiers={[
													font({ size: 16, weight: 'regular', design: 'rounded' }),
													foregroundStyle(theme.text.secondary),
													lineLimit(1)
												]}
											>
												{categoryTitle}
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
					placeholder="Filter services"
				/>
			</Stack.Toolbar>
		</>
	);
};

export default Services;
