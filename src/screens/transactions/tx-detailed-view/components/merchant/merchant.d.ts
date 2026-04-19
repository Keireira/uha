import type { PreparedDbTxT } from '@hooks/use-transactions';

export type Props = {
	date: Date;
	slug: PreparedDbTxT['slug'];
	logo_url: PreparedDbTxT['logo_url'];
	emoji: PreparedDbTxT['emoji'];
	customName: PreparedDbTxT['customName'];
	title: PreparedDbTxT['title'];
	color: PreparedDbTxT['color'];
};
