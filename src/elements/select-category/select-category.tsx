import React from 'react';
import { useTranslation } from 'react-i18next';
import { useTheme } from 'styled-components/native';

import { useAccent } from '@hooks';
import { useFilter, useParams } from './hooks';

import {
	bold,
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
import { NoResults } from '@elements';
import { Header, SearchBar } from './components';
import { Host, Text, HStack, RNHostView, List, Section, Spacer, Image } from '@expo/ui/swift-ui';

import type { SFSymbol } from 'expo-symbols';

const SelectCategoryScreen = () => {
	const theme = useTheme();
	const { t } = useTranslation();
	const settingAccent = useAccent();
	const { currentValue, commit } = useParams();
	const { categories, hasSearch, setSearchQuery } = useFilter();

	const onSelectHd = (categorySlug: string) => {
		if (typeof commit !== 'function') return;

		commit(categorySlug);
	};

	return (
		<>
			<Header />

			<Host style={{ flex: 1 }}>
				<List
					modifiers={[
						listStyle('insetGrouped'),
						scrollContentBackground('hidden'),
						scrollTargetBehavior('viewAligned'),
						scrollDismissesKeyboard('immediately')
					]}
				>
					<Section modifiers={[listRowSeparator('hidden', 'all'), listRowBackground('transparent')]}>
						{categories.map((category) => {
							const isActive = category.slug === currentValue;
							const title = t(`category.${category.slug}`, { defaultValue: category.title ?? category.slug });

							const selecteCategory = () => {
								onSelectHd(category.slug);
							};

							return (
								<HStack
									key={category.slug}
									spacing={16}
									modifiers={[
										onTapGesture(selecteCategory),
										contentShape(shapes.rectangle()),
										padding({ vertical: 6, horizontal: 0 }),
										frame({ maxWidth: Number.POSITIVE_INFINITY, alignment: 'leading' })
									]}
								>
									<RNHostView matchContents>
										<LogoView
											key={`${category.slug}-icon`}
											symbolName={category.symbol as SFSymbol}
											name={category.title || ''}
											emoji={category.emoji}
											color={category.color}
											size={48}
										/>
									</RNHostView>

									<Text
										modifiers={[
											font({ size: 20, design: 'rounded', weight: 'medium' }),
											foregroundStyle(isActive ? settingAccent : theme.text.primary),
											lineLimit(1)
										]}
									>
										{title}
									</Text>

									{isActive && (
										<>
											<Spacer />
											<Image systemName="checkmark" size={18} color={settingAccent} modifiers={[bold()]} />
										</>
									)}
								</HStack>
							);
						})}
					</Section>
				</List>
			</Host>

			{!categories.length && hasSearch && <NoResults />}

			<SearchBar setSearchQuery={setSearchQuery} />
		</>
	);
};

export default SelectCategoryScreen;
