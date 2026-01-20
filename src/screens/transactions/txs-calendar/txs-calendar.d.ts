import type { PreparedDbTxT } from '@hooks/use-transactions';

type Props = {
	transactions: PreparedDbTxT[];
};

export type CalendarEntryT = {
	raw: Date;
	item_key: string;
	content: string | undefined;
};
