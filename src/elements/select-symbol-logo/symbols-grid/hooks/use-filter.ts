import { groupBy, pluck } from 'ramda';
import { useFuzzySearchList } from '@nozbe/microfuzz/react';

import { SYMBOL_SECTIONS } from '@assets/data';

import type { SymbolSection } from '@assets/data';
import type { SFSymbol } from 'expo-symbols';

type FlatSymbol = {
	symbol: SFSymbol;
	sectionTitle: string;
};

const FLAT_SYMBOLS: FlatSymbol[] = SYMBOL_SECTIONS.flatMap((section) => {
	const sectionData = section.symbols.map((symbol) => ({
		symbol,
		sectionTitle: section.title
	}));

	return sectionData;
});

const getText = (item: FlatSymbol) => [item.symbol];
const mapResultItem = ({ item }: { item: FlatSymbol }) => item;

const useFilter = (query = '') => {
	const trimmed = query.trim();
	const matches = useFuzzySearchList({
		list: FLAT_SYMBOLS,
		queryText: trimmed,
		getText,
		mapResultItem
	});

	if (!trimmed) {
		return SYMBOL_SECTIONS;
	}

	const grouped = groupBy((item: FlatSymbol) => item.sectionTitle, matches);

	const sections = SYMBOL_SECTIONS.reduce<SymbolSection[]>((acc, section) => {
		const items = grouped[section.title];
		if (!items?.length) return acc;

		acc.push({
			title: section.title,
			icon: section.icon,
			symbols: pluck('symbol', items)
		});

		return acc;
	}, []);

	return sections;
};

export default useFilter;
