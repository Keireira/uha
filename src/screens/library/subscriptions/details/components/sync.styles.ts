import styled from 'styled-components/native';
import { GlassView } from 'expo-glass-effect';

import { withAlpha } from '@lib/colors';

export const ButtonLabel = styled.Text<{ $tintColor: string }>`
	color: ${({ $tintColor }) => $tintColor};
	font-size: 15px;
	font-weight: 600;
`;

export const ButtonInner = styled.Pressable<{ $tintColor: string }>`
	align-items: center;
	background-color: ${({ $tintColor }) => withAlpha($tintColor, 0.14)};
	flex-direction: row;
	gap: 8px;
	justify-content: center;
	padding: 14px 16px;
`;

export default styled(GlassView).attrs({
	isInteractive: true
})`
	align-self: stretch;
	border-radius: 14px;
	margin-top: 10px;
	margin-horizontal: 16px;
	overflow: hidden;
`;

export const FooterText = styled.Text`
	color: ${({ theme }) => theme.text.secondary};
	font-size: 12px;
	font-weight: 400;
	line-height: 16px;
	margin-horizontal: 32px;
	margin-top: 4px;
`;
