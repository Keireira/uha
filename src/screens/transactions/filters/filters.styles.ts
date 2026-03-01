import styled from 'styled-components/native';
import { H6 } from '@ui';

export const SectionHeader = styled(H6)`
	padding: 16px 0 4px;
	color: ${({ theme }) => theme.accent.orange};
`;

export const Entries = styled.View``;

export const Content = styled.ScrollView.attrs({
	automaticallyAdjustKeyboardInsets: true,
	showsVerticalScrollIndicator: false,
	keyboardShouldPersistTaps: 'handled',
	contentInsetAdjustmentBehavior: 'automatic'
})`
	flex: 1;
`;

export default styled.View.attrs({ collapsable: false })`
	flex: 1;
`;
