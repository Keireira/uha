import type { CategoryT } from '../../summaries.d';

export type Props = {
	clavis: string;
	total: number;
	formattedDate: string;
	categories: CategoryT[];
	isDisabled?: boolean;
};
