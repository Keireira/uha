import type { SectionHeaderRowT, RowItem } from './select-currency.d';

export const isHeaderSection = (item: RowItem): item is SectionHeaderRowT => {
	return 'type' in item && item.type === 'sectionHeader';
};
