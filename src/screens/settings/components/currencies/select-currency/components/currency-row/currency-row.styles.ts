import styled from 'styled-components/native';
import { SmallText } from '@ui';

export const Code = styled(SmallText)`
	color: ${({ theme }) => theme.text.secondary};
`;

export const Separator = styled.View`
	height: 0.5px;
	margin-left: 24px;
	background-color: ${({ theme }) => `${theme.border.default}50`};
`;

export default styled.Pressable`
	flex: 1;
	gap: 2px;
	padding: 12px 24px;
`;
