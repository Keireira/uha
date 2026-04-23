import styled from 'styled-components/native';
import { H6 } from '@ui';

export const Title = styled(H6)`
	margin-bottom: 12px;
	text-transform: uppercase;
	color: ${({ theme }) => theme.text.tertiary};
`;

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
