import styled from 'styled-components/native';

export const TitleField = styled.View`
	flex: 1;
`;

export default styled.ScrollView.attrs({
	showsVerticalScrollIndicator: false,
	keyboardShouldPersistTaps: 'handled',
	contentInsetAdjustmentBehavior: 'automatic',
	keyboardDismissMode: 'on-drag',
	contentContainerStyle: {
		gap: 16
	}
})`
	flex: 1;
	background-color: ${({ theme }) => theme.background.default};
`;
