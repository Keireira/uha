import { lightFormat } from 'date-fns';
import isHeaderSection from './is-header-section';

import type { ItemT } from '../year.d';

const keyExtractor = (row: ItemT) => {
	if (isHeaderSection(row)) {
		return `calendar-year-day-${row.title}`;
	}

	return `calendar-year-day-${lightFormat(row.data[0].monthDate, 'dd-MM-yyyy')}`;
};

export default keyExtractor;
