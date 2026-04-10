import styled from 'styled-components/native';

export default styled.ScrollView.attrs({
	showsVerticalScrollIndicator: false,
	keyboardShouldPersistTaps: 'handled' as const,
	contentInsetAdjustmentBehavior: 'automatic' as const,
	keyboardDismissMode: 'on-drag' as const
})`
	flex: 1;
	background-color: ${({ theme }) => theme.background.default};
`;
