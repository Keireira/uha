import type { SectionHeaderRowT, RowItem } from './select-store-option.d';

export const isHeaderSection = (item: RowItem): item is SectionHeaderRowT => {
	return 'type' in item && item.type === 'sectionHeader';
};
