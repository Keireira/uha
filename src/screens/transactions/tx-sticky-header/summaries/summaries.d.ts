import useSummariesQuery from './hooks/use-summaries';
import type { TxCategoryT } from '../../transactions';

export type SummariesQueryReturnT = ReturnType<typeof useSummariesQuery>;

export type CategoryAccumulatorT = {
	total: number;
	byCategoryId: Record<string, TxCategoryT>;
};

export type TxSummaryT = SummariesQueryReturnT['month'][number] | SummariesQueryReturnT['year'][number];

export type SummaryReturnT = {
	rawDate: Date;
	formattedDate: string;
	total: number;
	categories: TxCategoryT[];
	transactions: TxSummaryT[];
};
