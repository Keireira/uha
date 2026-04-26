import React from 'react';
import { useTheme } from 'styled-components/native';

import { useDraftStore } from '@screens/crossroad/add-subscription/hooks';
import { timelineErrors } from '@screens/crossroad/add-subscription/events';

import { SymbolView } from 'expo-symbols';
import Root, { ErrorTextBlock, ErrorLine } from './errors-banner.styles';

const ErrorBanner = () => {
	const theme = useTheme();

	const timeline = useDraftStore((state) => state.timeline);
	const errors = timelineErrors(timeline);

	if (!errors.length) {
		return null;
	}

	return (
		<Root>
			<SymbolView name="exclamationmark.triangle.fill" size={16} tintColor={theme.semantic.error} weight="semibold" />

			<ErrorTextBlock>
				{errors.map((err) => (
					<ErrorLine key={err.code}>{err.message}</ErrorLine>
				))}
			</ErrorTextBlock>
		</Root>
	);
};

export default ErrorBanner;
