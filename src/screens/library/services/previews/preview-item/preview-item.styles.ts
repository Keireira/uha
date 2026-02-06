import styled from 'styled-components/native';
import { GlassView } from 'expo-glass-effect';
import { Text } from '@ui';

export const Title = styled(Text).attrs({
	numberOfLines: 2
})`
	font-size: 12px;
	font-weight: 600;
	text-align: center;
	letter-spacing: 0.3px;
	color: ${({ theme }) => theme.text.primary};
`;

export const LogoGlass = styled(GlassView)`
	width: 56px;
	height: 56px;
	border-radius: 16px;
	overflow: hidden;
	align-items: center;
	justify-content: center;
`;

export default styled.View`
	display: flex;
	flex-direction: column;
	gap: 10px;
	align-items: center;
	justify-content: flex-start;
	padding: 10px 8px;
`;
