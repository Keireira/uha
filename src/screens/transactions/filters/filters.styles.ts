import styled from 'styled-components/native';
import { H6 } from '@ui';

export const Content = styled.ScrollView.attrs({
	automaticallyAdjustKeyboardInsets: true,
	showsVerticalScrollIndicator: false,
	keyboardShouldPersistTaps: 'handled',
	contentInsetAdjustmentBehavior: 'automatic',
	contentContainerStyle: {
		paddingRight: 24,
		paddingBottom: 96,
		paddingLeft: 24
	}
})`
	flex: 1;
`;

export const SectionHeader = styled(H6)`
	padding: 16px 0 4px;
	color: ${({ theme }) => theme.accent.orange};
`;

export const Entries = styled.View<{ $isSearching: boolean }>`
	margin-top: ${({ $isSearching }) => ($isSearching ? 118 : 64)}px;
`;

export default styled.View.attrs({ collapsable: false })`
	flex: 1;
`;
