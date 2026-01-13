import React from 'react';
import { Linking } from 'react-native';
import { useTheme } from 'styled-components/native';

import { SymbolView } from 'expo-symbols';
import { Trigger, InnerTextWrap, InnerText } from './text.styles';

import type { AccessoryTextMenuT } from './text.d';

const TextAccessory = ({ text, link }: AccessoryTextMenuT) => {
	const theme = useTheme();
	const isLink = typeof link === 'string' && link.length > 0;

	return (
		<Trigger onPress={isLink ? () => Linking.openURL(link) : undefined}>
			<InnerTextWrap>
				<InnerText>{text}</InnerText>
				{isLink && <SymbolView name="arrow.up.right" size={16} tintColor={theme.text.secondary} />}
			</InnerTextWrap>
		</Trigger>
	);
};

export default TextAccessory;
