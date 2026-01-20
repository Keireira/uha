import isHeaderSection from './is-header-section';

import type { ItemT } from '../year.d';

const getItemType = (row: ItemT) => {
	if (isHeaderSection(row)) {
		return 'sectionHeader';
	}

	return 'row';
};

export default getItemType;
