import React from 'react';
import styled from 'styled-components/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { View } from 'react-native';

import type { ViewProps } from 'react-native';
import type { EdgeInsets } from 'react-native-safe-area-context';

type Props<T extends ViewProps> = {
	as?: React.ElementType;
	children?: React.ReactNode;
	withTop?: boolean;
	withBottom?: boolean;
} & T;

const Root = styled.View<{ $insets: EdgeInsets; $withTop: boolean; $withBottom: boolean }>`
	flex: 1;
	background-color: ${({ theme }) => theme.background.default};
	padding-top: ${({ $insets, $withTop }) => ($withTop ? $insets.top + 24 : 0)}px;
	padding-bottom: ${({ $insets, $withBottom }) => ($withBottom ? $insets.bottom + 64 : 0)}px;
`;

const Wrapper = <T extends ViewProps = ViewProps>({
	children,
	withTop = true,
	withBottom = true,
	...props
}: Props<T>) => {
	const insets = useSafeAreaInsets();

	return (
		<Root {...props} $insets={insets} $withTop={withTop} $withBottom={withBottom}>
			{children || null}

			{withBottom && <View style={{ height: insets.bottom + 32 }} />}
		</Root>
	);
};

export default Wrapper;
