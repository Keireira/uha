import React, { useMemo, useRef } from 'react';
import { useTheme } from 'styled-components/native';

import { Pressable } from 'react-native';
import iconsMap, { CloseIcon } from '../icons';
import Root, { SearchInput } from './text-input.styles';

import type { Props } from './text-input.d';
import type { TextInput as RNTextInput } from 'react-native';

const TextInput = ({ leadingIcon, onClear, ...props }: Props) => {
	const theme = useTheme();
	const withText = Boolean(props.value?.length);
	const withClear = Boolean(onClear) && withText;
	const inputRef = useRef<RNTextInput>(null);

	const LeadingIcon = useMemo(() => {
		if (!leadingIcon) return null;

		return iconsMap.get(leadingIcon);
	}, [leadingIcon]);

	const focusTextInput = () => {
		inputRef.current?.focus();
	};

	return (
		<Root $withLeadingIcon={Boolean(LeadingIcon)} $withClear={withClear}>
			{LeadingIcon && (
				<LeadingIcon color={withText ? theme.text.tertiary : `${theme.text.tertiary}75`} onPress={focusTextInput} />
			)}

			<SearchInput {...props} ref={inputRef} placeholderTextColor={`${theme.text.tertiary}75`} />

			{withClear && (
				<Pressable onPress={onClear} hitSlop={12}>
					<CloseIcon color={withText ? theme.text.tertiary : `${theme.text.tertiary}75`} />
				</Pressable>
			)}
		</Root>
	);
};

export default TextInput;
