import styled from 'styled-components/native';
import { SmallText, H1 } from '@ui';

export const Label = styled(SmallText)`
	font-weight: 600;
	color: ${({ theme }) => theme.text.tertiary};
	letter-spacing: 0.2px;
`;

export const Code = styled(H1)`
	letter-spacing: -0.5px;
	font-weight: 800;
	margin-top: 2px;
`;

export const DayHint = styled(SmallText)`
	font-weight: 500;
	color: ${({ theme }) => `${theme.text.tertiary}90`};
	margin-top: 2px;
`;

export default styled.Pressable`
	flex: 1;
	padding: 16px;
	gap: 4px;
`;
