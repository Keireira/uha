import type { PreparedDbTxT } from '@hooks/use-transactions';

export type TenderMetaProps = {
	tenderTitle: PreparedDbTxT['tender_title'];
	tenderEmoji: PreparedDbTxT['tender_emoji'];
	tenderComment: PreparedDbTxT['tender_comment'];
};

export type IndexMetaProps = {
	categorySlug: PreparedDbTxT['category_slug'];
	categoryTitle: PreparedDbTxT['category_title'];
	currencyCode: PreparedDbTxT['currency_code'];
};

export type Props = {
	id: PreparedDbTxT['id'];
	comment: PreparedDbTxT['comment'];
} & IndexMetaProps &
	TenderMetaProps;
