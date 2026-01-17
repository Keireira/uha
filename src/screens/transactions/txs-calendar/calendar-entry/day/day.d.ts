import type { CalendarEntryT } from '../calendar-entry.d';
import type { PreparedDbTxT } from '@hooks/use-transactions';

export type Props = CalendarEntryT & {
	iconSize: number;
	isSelected: boolean;
	txs: PreparedDbTxT[];
	setSelectedDay: (date: Date) => void;
};
