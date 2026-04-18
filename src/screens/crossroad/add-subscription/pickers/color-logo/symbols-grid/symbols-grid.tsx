import React from 'react';

import { splitEvery } from 'ramda';
import { lighten } from '@lib/colors';

import { useNewSubStore } from '../../../hooks';
import { useFilter, useModifiers } from './hooks';
import { useShallow } from 'zustand/react/shallow';
import { useTheme } from 'styled-components/native';

import { COLUMNS, GRID_GAP, HORIZONTAL_PADDING } from './symbols-grid.d';

import { Host, VStack, HStack, Grid, Image, Text } from '@expo/ui/swift-ui';
import { font, padding, onTapGesture } from '@expo/ui/swift-ui/modifiers';

import type { Props } from './symbols-grid.d';

const SymbolGrid = ({ search }: Props) => {
	const theme = useTheme();
	const service = useNewSubStore(
		useShallow((state) => ({
			color: state.color,
			symbol: state.symbol,
			setBatch: state.actions.setBatch
		}))
	);

	const mods = useModifiers();
	const sections = useFilter(search);

	const handleSelectSymbol = (symbol: string) => {
		service.setBatch({
			logo_url: undefined,
			symbol: service.symbol === symbol ? undefined : symbol
		});
	};

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
							{splitEvery(COLUMNS, section.symbols).map((row, index) => (
								<Grid.Row key={`${section.title}-${index}`}>
									{row.map((symbol) => {
										const isSelected = service.symbol === symbol;
										const modifiers = isSelected ? mods.selected : mods.notSelected;

										return (
											<Image
												key={symbol}
												systemName={symbol}
												size={22}
												color={isSelected ? lighten(service.color, 0.5) : theme.text.secondary}
												modifiers={[...mods.shared, ...modifiers, onTapGesture(() => handleSelectSymbol(symbol))]}
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
