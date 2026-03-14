import type { TxCategoryT } from '../../summaries.d';

export type Props = {
	clavis: string;
	total: number;
	formattedDate: string;
	categories: TxCategoryT[];
	isDisabled?: boolean;
	onPress?: () => void;
};
