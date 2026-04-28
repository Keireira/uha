import React from 'react';
import { splitEvery } from 'ramda';
import { useShallow } from 'zustand/react/shallow';
import { useTheme } from 'styled-components/native';

import { useAccent } from '@hooks';
import { lighten } from '@lib/colors';
import { useDraftStore } from '@screens/crossroad/add-subscription/hooks';
import { useFilter, useModifiers } from './hooks';

import { font, padding, onTapGesture } from '@expo/ui/swift-ui/modifiers';
import { Host, VStack, HStack, Grid, Image, Text } from '@expo/ui/swift-ui';

import { COLUMNS, GRID_GAP, HORIZONTAL_PADDING } from './symbols-grid.constants';

import type { LogoDraftT } from '@screens/crossroad/add-subscription/events';
import type { Props } from './symbols-grid.d';

const SymbolGrid = ({ search }: Props) => {
	const theme = useTheme();
	const settingAccent = useAccent();
	const draft = useDraftStore(
		useShallow((state) => ({
			color: state.logo.color,
			symbol: state.logo.symbol,
			setLogoSymbol: state.actions.setLogoSymbol
		}))
	);

	const mods = useModifiers();
	const sections = useFilter(search);
	const selectedColor = lighten(draft.color ?? settingAccent, 0.5);

	const onSelectSymbolHd = (symbol: string) => {
		draft.setLogoSymbol(draft.symbol === symbol ? undefined : (symbol as LogoDraftT['symbol']));
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
										const isSelected = draft.symbol === symbol;
										const modifiers = isSelected ? mods.selected : mods.notSelected;

										return (
											<Image
												key={symbol}
												systemName={symbol}
												size={22}
												color={isSelected ? selectedColor : theme.text.secondary}
												modifiers={[...mods.shared, ...modifiers, onTapGesture(() => onSelectSymbolHd(symbol))]}
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
