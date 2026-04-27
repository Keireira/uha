import styled from 'styled-components/native';

export const Content = styled.View`
	flex: 1;
	flex-direction: column;
`;

export default styled.ScrollView.attrs({
	showsVerticalScrollIndicator: false,
	keyboardShouldPersistTaps: 'handled',
	contentInsetAdjustmentBehavior: 'automatic',
	keyboardDismissMode: 'on-drag'
})`
	flex: 1;
`;
