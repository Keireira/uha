import type { PreparedDbTxT } from '@hooks/use-transactions';

export type Props = {
	date: Date;
	slug: PreparedDbTxT['slug'];
	emoji: PreparedDbTxT['emoji'];
	customName: PreparedDbTxT['customName'];
	title: PreparedDbTxT['title'];
	color: PreparedDbTxT['color'];
	isPhantom: PreparedDbTxT['isPhantom'];
};
