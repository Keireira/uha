import useSummariesQuery from './hooks/use-summaries';

export type SummariesQueryReturnT = ReturnType<typeof useSummariesQuery>;

export type TxCategoryT = {
	id: string;
	amount: number;
	color: string;
};

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
};
