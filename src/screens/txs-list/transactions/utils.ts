import type { HeaderSectionT } from './transactions.d';
import type { TransactionProps } from './transaction-card/transaction-card.d';

export const isHeaderSection = (item: HeaderSectionT | TransactionProps): item is HeaderSectionT => {
	return 'type' in item && item.type === 'sectionHeader';
};
