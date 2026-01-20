import React from 'react';

import isHeaderSection from './is-header-section';

import { HeaderRow, QuarterRow } from '../components';

import type { ItemT } from '../year.d';
import type { ListRenderItemInfo } from '@shopify/flash-list';

const renderQuarterRow = ({ item }: ListRenderItemInfo<ItemT>) => {
	if (isHeaderSection(item)) {
		return <HeaderRow {...item} />;
	}

	return <QuarterRow quarterMonths={item.data} />;
};

export default renderQuarterRow;
