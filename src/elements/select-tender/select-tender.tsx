import React from 'react';

import { useAccent } from '@hooks';
import { useFilter, useParams } from './hooks';

import { LogoView } from '@ui';
import { NoResults } from '@elements';
import { SymbolView } from 'expo-symbols';
import { Header, SearchBar } from './components';
import Root, { Row, Description, Title, Comment } from './select-tender.styles';

const FALLBACK_COLOR = '#888';
const FALLBACK_EMOJI = '•';

const SelectTenderScreen = () => {
	const settingAccent = useAccent();
	const { currentValue, commit } = useParams();
	const { tenders, hasSearch, setSearchQuery } = useFilter();

	const onSelectHd = (tenderId: string | null) => {
		if (typeof commit !== 'function') return;

		commit(tenderId);
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

			{tenders.map((tender) => {
				const withComment = Boolean(tender.comment);
				const isActive = tender.id === currentValue;

				const onPressHd = () => onSelectHd(tender.id);

				return (
					<Row key={tender.id} onPress={onPressHd}>
						<LogoView emoji={tender.emoji ?? FALLBACK_EMOJI} color={tender.color ?? FALLBACK_COLOR} size={48} />

						<Description>
							<Title $isActive={isActive} $tintColor={settingAccent}>
								{tender.title}
							</Title>

							{withComment && <Comment>{tender.comment}</Comment>}
						</Description>

						{isActive && <SymbolView name="checkmark" size={16} weight="black" tintColor={settingAccent} />}
					</Row>
				);
			})}

			{!tenders.length && hasSearch && <NoResults />}

			<SearchBar setSearchQuery={setSearchQuery} />
		</Root>
	);
};

export default SelectTenderScreen;
