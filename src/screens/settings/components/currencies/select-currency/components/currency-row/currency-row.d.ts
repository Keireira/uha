import type { SectionRow, CurrencyItem } from '../../select-currency.d';

export type Props = {
	isLast: SectionRow['isLast'];
	isForbidden: boolean;
} & Omit<CurrencyItem, 'key'>;
