import type { PreparedDbTxT } from '@hooks/use-transactions';

export type Props = Omit<PreparedDbTxT, 'date'> & {
	date: Date;
};
