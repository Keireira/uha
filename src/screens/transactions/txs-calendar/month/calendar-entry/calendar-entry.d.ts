import type { PreparedDbTxT } from '@hooks/use-transactions';

export type Props = {
	monthDate: Date;
	transactions: PreparedDbTxT[];
};
