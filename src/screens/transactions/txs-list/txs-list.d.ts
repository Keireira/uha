import type { UseTranslationResponse } from 'react-i18next';
import type { PreparedDbTxT } from '@hooks/use-transactions';

export type Props = {
	transactions: PreparedDbTxT[];
};

export type TI18nT = UseTranslationResponse<string, undefined>['t'];

export type HeaderSectionT = {
	type: 'sectionHeader';
	date: string;
	total: string | null;
	rawDate: Date;
	txs: {
		currency_code: PreparedDbTxT['currency_code'];
		denominator: PreparedDbTxT['denominator'];
		price: PreparedDbTxT['price'];
	}[];
};
