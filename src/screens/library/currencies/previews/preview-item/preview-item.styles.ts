import styled from 'styled-components/native';
import { GlassView } from 'expo-glass-effect';
import { Text } from '@ui';

export const Symbol = styled(Text)`
	font-size: 22px;
	line-height: 48px;
	text-align: center;
`;

export const SymbolWrapper = styled(GlassView)`
	width: 48px;
	height: 48px;
	border-radius: 24px;
	overflow: hidden;
	align-items: center;
	justify-content: center;
`;

export const Code = styled(Text)`
	font-size: 12px;
	font-weight: 700;
	text-align: center;
	letter-spacing: 0.5px;
	color: ${({ theme }) => theme.text.primary};
`;

export const Region = styled(Text)`
	font-size: 10px;
	font-weight: 500;
	text-align: center;
	color: ${({ theme }) => theme.text.tertiary};
	text-transform: capitalize;
`;

export default styled.Pressable`
	display: flex;
	flex-direction: column;
	gap: 6px;
	align-items: center;
	justify-content: center;
	padding: 12px 4px;
`;
