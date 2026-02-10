import styled from 'styled-components/native';

export const Content = styled.View`
	flex: 1;
	flex-direction: column;
	padding-vertical: 20px;
`;

export default styled.ScrollView.attrs({
	automaticallyAdjustKeyboardInsets: true,
	keyboardShouldPersistTaps: 'handled',
	showsVerticalScrollIndicator: false,
	contentContainerStyle: {
		flexDirection: 'row',
		alignItems: 'stretch',
		paddingTop: 48,
		paddingRight: 24,
		paddingBottom: 24,
		paddingLeft: 20
	}
})`
	flex: 1;
`;
