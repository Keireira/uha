import React, { useMemo } from 'react';
import { useWindowDimensions } from 'react-native';
import { useTheme } from 'styled-components/native';

import { useNewSubStore } from '../../../hooks';
import { SYMBOL_SECTIONS } from '@elements/sf-symbols';

import { Host, VStack, HStack, Grid, Image, Text } from '@expo/ui/swift-ui';
import {
	frame,
	font,
	padding,
	clipShape,
	background,
	foregroundStyle,
	glassEffect,
	opacity,
	onTapGesture
} from '@expo/ui/swift-ui/modifiers';

import type { Props } from './symbol-grid.d';

const COLUMNS = 5;
const GRID_GAP = 10;
const HORIZONTAL_PADDING = 20;

const chunk = <T,>(arr: T[], size: number): T[][] => {
	const result: T[][] = [];
	for (let i = 0; i < arr.length; i += size) {
		result.push(arr.slice(i, i + size));
	}
	return result;
};

const SymbolGrid = ({ search }: Props) => {
	const theme = useTheme();
	const { width: screenWidth } = useWindowDimensions();
	const { actions, ...service } = useNewSubStore((state) => state);
	const cellSize = Math.floor((screenWidth - HORIZONTAL_PADDING * 2 - GRID_GAP * (COLUMNS - 1)) / COLUMNS);

	const handleSelectSymbol = (symbol: string) => {
		actions.setBatch({
			logo_url: undefined,
			symbol: service.symbol === symbol ? undefined : symbol
		});
	};

	const sections = useMemo(() => {
		if (!search.trim()) {
			return SYMBOL_SECTIONS.map((s) => ({ title: s.title, icon: s.icon, symbols: s.symbols }));
		}

		const q = search.toLowerCase();
		return SYMBOL_SECTIONS.map((s) => ({
			title: s.title,
			icon: s.icon,
			symbols: s.symbols.filter((sym) => sym.toLowerCase().includes(q))
		})).filter((s) => s.symbols.length > 0);
	}, [search]);

	return (
		<Host matchContents>
			<VStack alignment="leading" spacing={8} modifiers={[padding({ horizontal: HORIZONTAL_PADDING, bottom: 24 })]}>
				{sections.map((section) => (
					<VStack key={section.title} alignment="leading" spacing={8}>
						<HStack
							spacing={8}
							modifiers={[
								padding({ vertical: 8, horizontal: 12 }),
								background(theme.surface.default, { type: 'roundedRectangle', cornerRadius: 12 }),
								clipShape('roundedRectangle', 12)
							]}
						>
							<Image systemName={section.icon} size={16} color={theme.text.secondary} />
							<Text modifiers={[font({ size: 15, weight: 'semibold' }), foregroundStyle(theme.text.primary)]}>
								{section.title}
							</Text>
						</HStack>

						<Grid horizontalSpacing={GRID_GAP} verticalSpacing={GRID_GAP}>
							{chunk(section.symbols, COLUMNS).map((row, i) => (
								<Grid.Row key={i}>
									{row.map((symbol) => {
										const isSelected = service.symbol === symbol;

										return (
											<Image
												key={symbol}
												systemName={symbol}
												size={22}
												color={isSelected ? '#fff' : theme.text.secondary}
												modifiers={[
													frame({ width: cellSize, height: cellSize }),
													background(isSelected ? service.color : theme.surface.secondary, { type: 'circle' }),
													clipShape('circle'),
													isSelected &&
														glassEffect({
															glass: { variant: 'clear', tint: service.color },
															shape: 'circle'
														}),
													onTapGesture(() => handleSelectSymbol(symbol))
												].filter(Boolean)}
											/>
										);
									})}
									{row.length < COLUMNS &&
										Array.from({ length: COLUMNS - row.length }).map((_, j) => (
											<Text key={`pad-${j}`} modifiers={[frame({ width: cellSize, height: cellSize }), opacity(0)]}>
												{' '}
											</Text>
										))}
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
