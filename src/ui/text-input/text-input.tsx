import React, { useMemo, useRef } from 'react';

import iconsMap from '../icons';
import Root, { SearchInput } from './text-input.styles';

import type { TextInput as RNTextInput } from 'react-native';
import type { Props } from './text-input.d';

const TextInput = ({ leadingIcon, ...props }: Props) => {
	const inputRef = useRef<RNTextInput>(null);

	const LeadingIcon = useMemo(() => {
		if (!leadingIcon) return null;

		return iconsMap.get(leadingIcon);
	}, [leadingIcon]);

	const focusTextInput = () => {
		inputRef.current?.focus();
	};

	return (
		<Root $withLeadingIcon={Boolean(LeadingIcon)}>
			{LeadingIcon && <LeadingIcon color="#333" onPress={focusTextInput} />}

			<SearchInput {...props} ref={inputRef} />
		</Root>
	);
};

export default TextInput;
