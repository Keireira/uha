import type { CalendarEntryT } from '../calendar-entry.d';
import type { PreparedDbTxT } from '@hooks/use-transactions';

export type Props = CalendarEntryT & {
	isSelected: boolean;
	txs: PreparedDbTxT[];
	setSelectedDay: (date: Date) => void;
};
