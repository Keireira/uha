import React from 'react';
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
import { Header, SearchBar } from './components';
import {
	Host,
	Text,
	VStack,
	HStack,
	RNHostView,
	List,
	Section,
	Spacer,
	Image,
	ContentUnavailableView
} from '@expo/ui/swift-ui';

import type { SFSymbol } from 'expo-symbols';

const SelectTenderScreen = () => {
	const theme = useTheme();
	const settingAccent = useAccent();
	const { currentValue, commit } = useParams();
	const { tenders, hasSearch, setSearchQuery } = useFilter();

	const onSelectHd = (tenderId: string | null) => {
		if (typeof commit !== 'function') return;

		commit(tenderId);
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
						{tenders.map((tender) => {
							const withComment = Boolean(tender.comment);
							const isActive = tender.id === currentValue;

							const selectTender = () => {
								onSelectHd(tender.id);
							};

							return (
								<HStack
									key={tender.id}
									spacing={16}
									modifiers={[
										contentShape(shapes.rectangle()),
										onTapGesture(selectTender),
										padding({ vertical: 6, horizontal: 0 }),
										frame({ maxWidth: Number.POSITIVE_INFINITY, alignment: 'leading' })
									]}
								>
									<RNHostView matchContents>
										<LogoView
											key={`${tender.id}-icon`}
											symbolName={tender.symbol as SFSymbol}
											color={tender.color || settingAccent}
											name={tender.title || ''}
											url={tender.logo_url}
											emoji={tender.emoji}
											size={48}
										/>
									</RNHostView>

									<VStack alignment="leading" spacing={4}>
										<Text
											modifiers={[
												font({ size: 20, design: 'rounded', weight: 'medium' }),
												foregroundStyle(isActive ? settingAccent : theme.text.primary),
												lineLimit(1)
											]}
										>
											{tender.title}
										</Text>

										{withComment && (
											<Text
												modifiers={[
													font({ size: 16, design: 'rounded', weight: 'regular' }),
													foregroundStyle(theme.text.secondary),
													lineLimit(1)
												]}
											>
												{tender.comment}
											</Text>
										)}
									</VStack>

									<Spacer />

									{isActive && <Image systemName="checkmark" size={18} color={settingAccent} modifiers={[bold()]} />}
								</HStack>
							);
						})}
					</Section>
				</List>

				{!tenders.length && hasSearch && (
					<ContentUnavailableView title="No payment methods found" systemImage="magnifyingglass" />
				)}
			</Host>

			<SearchBar setSearchQuery={setSearchQuery} />
		</>
	);
};

export default SelectTenderScreen;
