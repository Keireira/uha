import { useCallback } from 'react';
import { useAppModel } from '@models';

import { isHeaderSection } from '../utils';

import type { ViewToken } from '@shopify/flash-list';
import type { HeaderSectionT } from '../txs-list.d';
import type { TransactionProps } from '../components/transaction-card/transaction-card.d';

type ViewableItemsT = {
	viewableItems: ViewToken<HeaderSectionT | TransactionProps>[];
};

const useGetViewableItem = () => {
	const { tx_dates } = useAppModel();

	const handleViewableItemsChanged = useCallback(({ viewableItems }: ViewableItemsT) => {
		if (viewableItems.length === 0) return;

		const possibleItem = viewableItems[1]?.item;
		const index = viewableItems[1] ? 1 : 0;

		let firstItem = possibleItem || viewableItems[index]?.item;
		if (isHeaderSection(firstItem)) {
			firstItem = viewableItems[index + 1]?.item;
		}

		if (firstItem) {
			const dates = new Date(firstItem.date);

			tx_dates.focused.set(dates);
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	return handleViewableItemsChanged;
};

export default useGetViewableItem;
