import type { PreparedDbTxT } from '@hooks/use-transactions';

export type Props = {
	date: Date;
	isPhantom: PreparedDbTxT['isPhantom'];
	currencyCode: PreparedDbTxT['currency_code'];
	price: PreparedDbTxT['price'];
	denominator: PreparedDbTxT['denominator'];
};
