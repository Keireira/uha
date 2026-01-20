import { lightFormat } from 'date-fns';

import type { HeaderRowT, QuarterRowT, ItemT } from '../year.d';

export const isHeaderSection = (row: HeaderRowT | QuarterRowT): row is HeaderRowT => {
	return 'kind' in row && row.kind === 'header';
};

export const getItemType = (row: ItemT) => {
	if (isHeaderSection(row)) {
		return 'sectionHeader';
	}

	return 'row';
};

export const keyExtractor = (row: ItemT) => {
	if (isHeaderSection(row)) {
		return `calendar-year-header-${row.title}`;
	}

	return `calendar-year-quarter-${lightFormat(row[0].monthDate, 'yyyy-MM-dd')}`;
};
