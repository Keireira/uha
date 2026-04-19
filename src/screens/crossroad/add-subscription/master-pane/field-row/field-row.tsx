import React from 'react';
import { useTheme } from 'styled-components/native';
import { SymbolView } from 'expo-symbols';

import Root, { Label, Value, ValueText } from './field-row.styles';

import type { Props } from './field-row.d';

const FieldRow = ({ label, preview, onPress, isLast = false }: Props) => {
	const theme = useTheme();

	return (
		<Root onPress={onPress} $isLast={isLast}>
			<Label>{label}</Label>

			<Value>
				<ValueText numberOfLines={1}>{preview}</ValueText>
				<SymbolView name="chevron.right" size={12} tintColor={theme.text.tertiary} />
			</Value>
		</Root>
	);
};

export default FieldRow;
