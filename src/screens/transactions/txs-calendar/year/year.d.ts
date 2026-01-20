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
	monthDate: Date; // 3 months per row
	isMonthInRange: boolean;
	title: string; // Sep
	daysWithTxs: Set<string>; // dd-MM-yyyy[]
};

export type QuarterRowT = QuarterRowDataT[];

export type ItemT = HeaderRowT | QuarterRowT;
