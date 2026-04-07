export type SearchParamsT = {
	target: 'appstore_country' | 'playstore_country' | 'playstore_lang';
};

export type OptionItem = {
	id: string;
	key: string;
	search_key: string;
	code: string;
	name: string;
	subtitle?: string;
};

export type OptionSection = {
	title: string;
	data: OptionItem[];
};

export type SectionHeaderRowT = {
	type: 'sectionHeader';
	title: string;
};

export type SectionRow = {
	type: 'row';
	item: OptionItem;
	isLast: boolean;
};

export type RowItem = SectionHeaderRowT | SectionRow;
