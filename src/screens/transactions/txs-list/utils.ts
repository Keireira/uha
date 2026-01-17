import type { HeaderSectionT } from './txs-list.d';
import type { TransactionProps } from './components/transaction-card/transaction-card.d';

export const isHeaderSection = (item: HeaderSectionT | TransactionProps): item is HeaderSectionT => {
	return 'type' in item && item.type === 'sectionHeader';
};
