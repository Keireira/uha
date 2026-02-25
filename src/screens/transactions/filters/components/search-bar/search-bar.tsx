import React from 'react';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme } from 'styled-components/native';

import { Host, TextField as SwiftUITextField } from '@expo/ui/swift-ui';
import { frame, padding, foregroundStyle } from '@expo/ui/swift-ui/modifiers';
import { FullWindowOverlay } from 'react-native-screens';
import Root from './search-bar.styles';

import type { Props } from './search-bar.d';

const SearchBar = ({ searchQuery, setSearchQuery }: Props) => {
	const insets = useSafeAreaInsets();
	const theme = useTheme();

	return (
		<FullWindowOverlay>
			<Root $insets={insets}>
				<Host matchContents>
					<SwiftUITextField
						onChangeText={setSearchQuery}
						defaultValue={searchQuery}
						placeholder="Search"
						keyboardType="default"
						autocorrection={false}
						multiline={false}
						allowNewlines={false}
						numberOfLines={1}
						modifiers={[
							frame({
								width: 100,
								height: 100
							}),
							padding({
								all: 12
							}),
							foregroundStyle({
								type: 'color',
								color: theme.text.primary
							})
						]}
					/>
				</Host>
			</Root>
		</FullWindowOverlay>
	);
};

export default SearchBar;
