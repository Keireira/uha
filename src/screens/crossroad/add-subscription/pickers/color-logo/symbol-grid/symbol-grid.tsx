import React from 'react';
import { splitEvery } from 'ramda';

import { useNewSubStore } from '../../../hooks';
import { useWindowDimensions } from 'react-native';
import { useTheme } from 'styled-components/native';
import { SYMBOL_SECTIONS } from '@assets/data';

import { Host, VStack, HStack, Grid, Image, Text } from '@expo/ui/swift-ui';
import { font, frame, padding, clipShape, background, glassEffect, onTapGesture } from '@expo/ui/swift-ui/modifiers';

import type { Props } from './symbol-grid.d';
import type { SymbolSection } from '@assets/data';

const COLUMNS = 5;
const GRID_GAP = 10;
const HORIZONTAL_PADDING = 20;

const filterSections = (query: string) => {
	if (!query) {
		return SYMBOL_SECTIONS.map((section) => ({
			icon: section.icon,
			title: section.title,
			symbols: section.symbols
		}));
	}

	const lower = query.toLowerCase();
	const filtered: SymbolSection[] = [];

	for (const section of SYMBOL_SECTIONS) {
		const symbols = section.symbols.filter((sym) => sym.toLowerCase().includes(lower));

		if (symbols.length) {
			filtered.push({ title: section.title, icon: section.icon, symbols });
		}
	}

	return filtered;
};

const SymbolGrid = ({ search }: Props) => {
	const theme = useTheme();
	const { width: screenWidth } = useWindowDimensions();
	const { actions, ...service } = useNewSubStore((state) => state);

	const sections = filterSections(search.trim());
	const cellSize = Math.floor((screenWidth - HORIZONTAL_PADDING * 2 - GRID_GAP * (COLUMNS - 1)) / COLUMNS);

	const handleSelectSymbol = (symbol: string) => {
		actions.setBatch({
			logo_url: undefined,
			symbol: service.symbol === symbol ? undefined : symbol
		});
	};

	const SELECTED = [
		background(service.color, { shape: 'circle' }),
		glassEffect({
			glass: { variant: 'clear', tint: service.color },
			shape: 'circle'
		})
	];
	const NOT_SELECTED = [background(theme.surface.secondary, { shape: 'circle' })];

	return (
		<Host matchContents>
			<VStack alignment="leading" spacing={8} modifiers={[padding({ horizontal: HORIZONTAL_PADDING, bottom: 24 })]}>
				{sections.map((section) => (
					<VStack key={section.title} alignment="leading" spacing={8}>
						<HStack spacing={8} modifiers={[padding({ vertical: 8 })]}>
							<Image systemName={section.icon} size={16} color={theme.text.secondary} />

							<Text modifiers={[font({ family: 'Nunito', size: 18, weight: 'semibold' })]}>{section.title}</Text>
						</HStack>

						<Grid horizontalSpacing={GRID_GAP} verticalSpacing={GRID_GAP}>
							{splitEvery(COLUMNS, section.symbols).map((row) => (
								<Grid.Row key={row[0]}>
									{row.map((symbol) => {
										const isSelected = service.symbol === symbol;
										const modifiers = isSelected ? SELECTED : NOT_SELECTED;

										return (
											<Image
												key={symbol}
												systemName={symbol}
												size={22}
												color={isSelected ? theme.static.pure_white : theme.text.secondary}
												modifiers={[
													frame({ width: cellSize, height: cellSize }),
													clipShape('circle'),
													...modifiers,
													onTapGesture(() => handleSelectSymbol(symbol))
												]}
											/>
										);
									})}
								</Grid.Row>
							))}
						</Grid>
					</VStack>
				))}
			</VStack>
		</Host>
	);
};

export default SymbolGrid;
