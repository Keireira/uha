import styled from 'styled-components/native';
import { GlassView } from 'expo-glass-effect';
import { H6, SmallText } from '@ui';

export const Domain = styled(SmallText)`
	font-size: 13px;
	color: ${({ theme }) => theme.text.tertiary};
`;

export const Info = styled.View`
	flex: 1;
	gap: 3px;
`;

export const Inner = styled.Pressable`
	flex-direction: row;
	align-items: center;
	gap: 16px;
	padding: 16px 20px;
`;

export const GlassCard = styled(GlassView)`
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
