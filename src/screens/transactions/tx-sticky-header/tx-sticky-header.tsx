import React from 'react';
import { View } from 'react-native';
import { useTheme } from 'styled-components/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { useSearchParams } from '@hooks';

import TxHeader from './tx-header';
import Summaries from './summaries';

const TxStickyHeader = () => {
	const theme = useTheme();
	const insets = useSafeAreaInsets();
	const { txViewMode, calendarScale } = useSearchParams();

	const withSummaries = txViewMode === 'list' || calendarScale === 'month';

	return (
		<View
			style={{
				paddingTop: insets.top,
				paddingBottom: 8,
				gap: 8,
				backgroundColor: theme.background.default
			}}
		>
			<TxHeader />

			{withSummaries && <Summaries />}
		</View>
	);
};

export default TxStickyHeader;
