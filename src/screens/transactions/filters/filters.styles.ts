import styled from 'styled-components/native';

export const Content = styled.ScrollView.attrs({
	automaticallyAdjustKeyboardInsets: true,
	showsVerticalScrollIndicator: false,
	keyboardShouldPersistTaps: 'handled',
	contentContainerStyle: {
		paddingTop: 136,
		paddingRight: 24,
		paddingBottom: 24,
		paddingLeft: 24
	}
})`
	flex: 1;
	margin-top: -136px;
`;

export default styled.View.attrs({ collapsable: false })`
	flex: 1;
`;
