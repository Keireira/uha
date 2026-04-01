import type { TxCategoryT } from '@screens/transactions/transactions.d';

export type Props = {
	clavis: string;
	total: number;
	formattedDate: string;
	categories: TxCategoryT[];
	isDisabled?: boolean;
	onPress?: () => void;
};
