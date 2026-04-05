import styled from 'styled-components/native';
import { GlassView } from 'expo-glass-effect';
import { H6, SmallText } from '@ui';

export const Footer = styled(SmallText)`
	margin-top: 10px;
	margin-horizontal: 4px;
	color: ${({ theme }) => theme.text.tertiary};
`;

export const Card = styled(GlassView)`
	border-radius: 20px;
	overflow: hidden;
`;

export const Label = styled(H6)`
	font-size: 12px;
	letter-spacing: 0.5px;
	text-transform: uppercase;
	margin-bottom: 10px;
	margin-left: 4px;
	color: ${({ theme }) => theme.text.tertiary};
`;

export default styled.View`
	padding-horizontal: 16px;
	margin-bottom: 28px;
`;
