import type { PreparedDbTxT } from '@hooks/use-transactions';

export type Props = {
	date: Date;
	price: PreparedDbTxT['price'];
	currencyCode: PreparedDbTxT['currency_code'];
};
