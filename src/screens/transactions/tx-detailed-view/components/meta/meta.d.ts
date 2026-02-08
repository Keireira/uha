import type { PreparedDbTxT } from '@hooks/use-transactions';

export type Props = {
	id: PreparedDbTxT['id'];

	categoryTitle: PreparedDbTxT['category_title'];
	currencyCode: PreparedDbTxT['currency_code'];

	tenderTitle: PreparedDbTxT['tender_title'];
	tenderEmoji: PreparedDbTxT['tender_emoji'];
	tenderComment: PreparedDbTxT['tender_comment'];

	comment: PreparedDbTxT['comment'];
};
