import React, { useMemo } from 'react';
import { SectionList, View, useWindowDimensions } from 'react-native';
import { SymbolView } from 'expo-symbols';
import styled, { useTheme } from 'styled-components/native';

import { SYMBOL_SECTIONS } from '@elements/sf-symbols';
import { Text } from '@ui';

const COLUMNS = 5;
const GRID_GAP = 10;
const HORIZONTAL_PADDING = 20;

type Props = {
	selected: string | null;
	color: string;
	search: string;
	onSelect: (symbol: string) => void;
};

const SymbolGrid = ({ selected, color, search, onSelect }: Props) => {
	const theme = useTheme();
	const { width: screenWidth } = useWindowDimensions();
	const cellSize = Math.floor((screenWidth - HORIZONTAL_PADDING * 2 - GRID_GAP * (COLUMNS - 1)) / COLUMNS);

	const sections = useMemo(() => {
		if (!search.trim()) {
			return SYMBOL_SECTIONS.map((s) => ({ title: s.title, icon: s.icon, data: [s.symbols] }));
		}

		const q = search.toLowerCase();
		const filtered = SYMBOL_SECTIONS.map((s) => ({
			title: s.title,
			icon: s.icon,
			data: [s.symbols.filter((sym) => sym.toLowerCase().includes(q))]
		})).filter((s) => s.data[0].length > 0);

		return filtered;
	}, [search]);

	const renderSymbol = (symbol: string) => (
		<SymbolCell
			key={symbol}
			$selected={selected === symbol}
			$color={color}
			style={{ width: cellSize, height: cellSize, borderRadius: cellSize / 2 }}
			onPress={() => onSelect(symbol)}
		>
			<SymbolView name={symbol} size={22} tintColor={selected === symbol ? '#fff' : theme.text.secondary} />
		</SymbolCell>
	);

	return (
		<View style={{ flex: 1 }}>
			<SectionList
				sections={sections}
				keyExtractor={(_, index) => String(index)}
				stickySectionHeadersEnabled={false}
				showsVerticalScrollIndicator={false}
				renderSectionHeader={({ section }) => (
					<SectionHeader>
						<SymbolView name={section.icon} size={16} tintColor={theme.text.secondary} />
						<SectionTitle>{section.title}</SectionTitle>
					</SectionHeader>
				)}
				renderItem={({ item: symbols }) => <Grid style={{ gap: GRID_GAP }}>{symbols.map(renderSymbol)}</Grid>}
				contentContainerStyle={{ gap: 8, paddingBottom: 24 }}
			/>
		</View>
	);
};

const SectionHeader = styled.View`
	flex-direction: row;
	align-items: center;
	gap: 8px;
	padding: 12px 4px 8px;
	background-color: ${({ theme }) => theme.surface.default};
	border-radius: 12px;
	padding-horizontal: 12px;
	margin-bottom: 8px;
`;

const SectionTitle = styled(Text)`
	font-size: 15px;
	font-weight: 600;
	color: ${({ theme }) => theme.text.primary};
`;

const Grid = styled.View`
	flex-direction: row;
	flex-wrap: wrap;
	margin-bottom: 8px;
`;

const SymbolCell = styled.Pressable<{ $selected: boolean; $color: string }>`
	align-items: center;
	justify-content: center;
	background-color: ${({ $selected, $color, theme }) => ($selected ? $color : theme.surface.secondary)};
`;

export default SymbolGrid;
