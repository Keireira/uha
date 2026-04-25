import React from 'react';
import { useTranslation } from 'react-i18next';

import { useAccent } from '@hooks';
import { useFilter, useParams } from './hooks';

import { LogoView } from '@ui';
import { NoResults } from '@elements';
import { SymbolView } from 'expo-symbols';
import { Header, SearchBar } from './components';
import Root, { Row, Title, Check } from './select-category.styles';

const FALLBACK_COLOR = '#888';
const FALLBACK_EMOJI = '•';

const SelectCategoryScreen = () => {
	const { t } = useTranslation();
	const settingAccent = useAccent();
	const { currentValue, commit } = useParams();
	const { categories, hasSearch, setSearchQuery } = useFilter();

	const onSelectHd = (categorySlug: string) => {
		if (typeof commit !== 'function') return;

		commit(categorySlug);
	};

	return (
		<Root
			showsVerticalScrollIndicator={false}
			contentContainerStyle={{
				paddingTop: 70,
				paddingBottom: 84,
				gap: 6
			}}
		>
			<Header />
			{categories.map((category) => {
				const isActive = category.slug === currentValue;
				const localized = t(`category.${category.slug}`, { defaultValue: category.title });

				return (
					<Row key={category.slug} onPress={() => onSelectHd(category.slug)}>
						<LogoView emoji={category.emoji ?? FALLBACK_EMOJI} color={category.color ?? FALLBACK_COLOR} size={48} />

						<Title $isActive={isActive} $tintColor={settingAccent} numberOfLines={1} ellipsizeMode="tail">
							{localized}
						</Title>

						{isActive && (
							<Check>
								<SymbolView name="checkmark" size={16} tintColor={settingAccent} />
							</Check>
						)}
					</Row>
				);
			})}

			{!categories.length && hasSearch && <NoResults />}

			<SearchBar setSearchQuery={setSearchQuery} />
		</Root>
	);
};

export default SelectCategoryScreen;
