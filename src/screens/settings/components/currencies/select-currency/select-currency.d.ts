export type SearchParamsT = {
	target: 'default_currency' | 'recalc_currency';
};

export type CurrencyItem = {
	id: string;
	name: string;
	code: string;
	key: string;
	search_key: string;
};

export type CurrencySection = {
	title: string;
	data: CurrencyItem[];
};

export type SectionHeaderRowT = {
	type: 'sectionHeader';
	title: string;
};

export type SectionRow = {
	type: 'row';
	item: CurrencyItem;
	isLast: boolean;
};

export type RowItem = SectionHeaderRowT | SectionRow;
