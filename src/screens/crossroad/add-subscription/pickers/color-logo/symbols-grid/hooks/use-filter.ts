import { groupBy, has, pluck } from 'ramda';
import { useFuzzySearchList } from '@nozbe/microfuzz/react';
import { SYMBOL_SECTIONS } from '@assets/data';

import type { SymbolSection } from '@assets/data';
import type { SFSymbol } from 'sf-symbols-typescript';

type FlatSymbol = {
	symbol: SFSymbol;
	sectionTitle: string;
	sectionIcon: SFSymbol;
};

const FLAT_SYMBOLS: FlatSymbol[] = SYMBOL_SECTIONS.flatMap((section) => {
	const mapped = section.symbols.map((symbol) => ({
		symbol,
		sectionTitle: section.title,
		sectionIcon: section.icon
	}));

	return mapped;
});

const getText = (item: FlatSymbol) => [item.symbol];
const mapResultItem = ({ item }: { item: FlatSymbol }) => item;

const useFilter = (query: string = '') => {
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
		// We want to keep the order of sections here
		if (!has(section.title, grouped)) return acc;

		acc.push({
			title: section.title,
			icon: section.icon,
			symbols: pluck('symbol', grouped[section.title] ?? [])
		});

		return acc;
	}, []);

	return sections satisfies readonly SymbolSection[];
};

export default useFilter;
