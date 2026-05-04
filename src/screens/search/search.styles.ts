import styled from 'styled-components/native';

export default styled.ScrollView.attrs({
	showsVerticalScrollIndicator: false,
	keyboardShouldPersistTaps: 'handled',
	contentInsetAdjustmentBehavior: 'automatic',
	keyboardDismissMode: 'on-drag'
})`
	flex: 1;
	background-color: ${({ theme }) => theme.background.default};
`;
