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
import { categoriesTable, servicesTable, subscriptionsTable } from '@db/schema';

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
import { Host, Text, HStack, VStack, ZStack, Image, Circle, List, Section, Spacer } from '@expo/ui/swift-ui';

import type { SFSymbol } from 'sf-symbols-typescript';
import type { TextInputChangeEvent } from 'react-native';

type ServiceRowT = {
	service: typeof servicesTable.$inferSelect;
	category: typeof categoriesTable.$inferSelect | null;
};

const getText = ({ service, category }: ServiceRowT) => [
	service.title,
	service.slug ?? '',
	category?.title ?? '',
	...(service.aliases ?? [])
];
const mapResultItem = ({ item }: { item: ServiceRowT }) => item;

const Services = () => {
	const theme = useTheme();
	const { t } = useTranslation();
	const settingAccent = useAccent();
	const [searchQuery, setSearchQuery] = useState('');
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
		mapResultItem
	});

	const handleChangeText = (e: TextInputChangeEvent) => {
		setSearchQuery(e.nativeEvent.text.trim());
	};

	const services = searchQuery ? matches : data;

	const deleteService = (id: string) => async () => {
		const [{ count = 0 } = {}] = await db
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
							const tone = service.color || settingAccent;
							const subtitle =
								(category && t(`category.${category.slug}`, { defaultValue: category.title ?? category.slug })) ??
								service.category_slug;

							return (
								<HStack
									key={service.id}
									spacing={12}
									modifiers={[
										padding({ vertical: 6, horizontal: 0 }),
										onTapGesture(() => openLibraryDetails('service', service.id, service.title)),
										swipeActions({
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
											{service.title}
										</Text>
										<Text
											modifiers={[
												font({ size: 13, design: 'rounded' }),
												foregroundStyle(theme.text.secondary),
												lineLimit(1)
											]}
										>
											{subtitle}
										</Text>
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
