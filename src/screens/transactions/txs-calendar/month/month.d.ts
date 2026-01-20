import React from 'react';
import PagerView from 'react-native-pager-view';
import type { PreparedDbTxT } from '@hooks/use-transactions';

export type Props = {
	transactions: PreparedDbTxT[];
};

export type PagerRef = React.ComponentRef<typeof PagerView>;
