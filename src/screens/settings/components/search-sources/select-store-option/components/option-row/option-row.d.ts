import type { SectionRow, OptionItem } from '../../select-store-option.d';

export type Props = {
	isLast: SectionRow['isLast'];
} & Omit<OptionItem, 'key'>;
