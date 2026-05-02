import React from 'react';
import { splitEvery } from 'ramda';
import { useTheme } from 'styled-components/native';

import { useAccent } from '@hooks';
import { useParams } from '../hooks';
import { lighten } from '@lib/colors';
import { useFilter, useModifiers } from './hooks';

import { font, padding, onTapGesture } from '@expo/ui/swift-ui/modifiers';
import { Host, VStack, HStack, Grid, Image, Text } from '@expo/ui/swift-ui';

import { COLUMNS, GRID_GAP, HORIZONTAL_PADDING } from './symbols-grid.constants';

import type { Props } from './symbols-grid.d';
import type { SFSymbol } from 'expo-symbols';

const SymbolGrid = ({ search }: Props) => {
	const theme = useTheme();
	const settingAccent = useAccent();
	const paramsBinding = useParams();

	const sections = useFilter(search);
	const modifiers = useModifiers(paramsBinding.color);
	const selectedColor = lighten(paramsBinding.color ?? settingAccent, 0.5);

	const onSelectSymbolHd = (symbol: SFSymbol) => {
		paramsBinding.setSymbol(paramsBinding.symbol === symbol ? undefined : symbol);
	};

	return (
		<Host matchContents>
			<VStack alignment="leading" spacing={8} modifiers={[padding({ horizontal: HORIZONTAL_PADDING, bottom: 24 })]}>
				{sections.map((section) => (
					<VStack key={section.title} alignment="leading" spacing={8}>
						<HStack spacing={8} modifiers={[padding({ vertical: 8 })]}>
							<Image systemName={section.icon} size={16} color={theme.text.secondary} />

							<Text modifiers={[font({ design: 'rounded', size: 18, weight: 'semibold' })]}>{section.title}</Text>
						</HStack>

						<Grid horizontalSpacing={GRID_GAP} verticalSpacing={GRID_GAP}>
							{splitEvery(COLUMNS, section.symbols).map((row, index) => (
								<Grid.Row key={`${section.title}-${index}`}>
									{row.map((symbol) => {
										const isSelected = paramsBinding.symbol === symbol;
										const localModifiers = isSelected ? modifiers.selected : modifiers.notSelected;

										return (
											<Image
												key={symbol}
												size={22}
												systemName={symbol}
												color={isSelected ? selectedColor : theme.text.secondary}
												modifiers={[
													...modifiers.shared,
													...localModifiers,
													onTapGesture(() => onSelectSymbolHd(symbol))
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
