import useSummariesQuery from './hooks/use-summaries';

import { PreparedDbTxT } from '@hooks/use-transactions';

export type Props = {
	transactions: PreparedDbTxT[];
};

export type SummariesQueryReturnT = ReturnType<typeof useSummariesQuery>;

export type CategoryT = {
	id: string;
	amount: number;
	color: string;
};

export type CategoryAccumulatorT = {
	total: number;
	byCategoryId: Record<string, CategoryT>;
};

export type TransactionT = SummariesQueryReturnT['month'][number] | SummariesQueryReturnT['year'][number];

export type SummaryReturnT = {
	rawDate: Date;
	formattedDate: string;
	total: number;
	categories: CategoryT[];
};
