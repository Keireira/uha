import type { SectionRow, OptionItem } from '../../select-store-option.d';

export type Props = {
	isLast: SectionRow['isLast'];
	isForbidden: boolean;
} & Omit<OptionItem, 'key'>;
