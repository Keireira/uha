import type { PreparedDbTxT } from '@hooks/use-transactions';

export type Props = {
	transactions: PreparedDbTxT[];
};

export type HeaderRowT = {
	kind: 'header';
	title: string;
};

export type QuarterRowDataT = {
	list_key: string;
	monthDate: Date; // dd-MM-yyyy (3 months per row)
	isMonthInRange: boolean;
	title: string; // Sep
	daysWithTransactions: Date[]; // dd-MM-yyyy[]
};

export type QuarterRowT = {
	kind: 'quarter';
	data: QuarterRowDataT[];
};

export type ItemT = HeaderRowT | QuarterRowT;
