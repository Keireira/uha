import type { CalendarEntryT } from '../calendar-entry.d';
import type { PreparedDbTxT } from '@hooks/use-transactions';

export type Props = CalendarEntryT & {
	txs: PreparedDbTxT[];
};
