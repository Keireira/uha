import styled from 'styled-components/native';
import { Text } from '@ui';

export const Title = styled(Text)`
	font-size: 13px;
	font-weight: 500;
	color: ${({ theme }) => theme.text.tertiary};
	letter-spacing: 0.5px;
	text-align: center;
`;

export default styled.View`
	width: 100%;
	padding: 32px 20px;
	border-radius: 16px;
	border-width: 1px;
	border-style: dashed;
	border-color: ${({ theme }) => `${theme.border.default}40`};
`;
