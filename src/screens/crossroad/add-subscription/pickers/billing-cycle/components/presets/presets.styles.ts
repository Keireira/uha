import styled from 'styled-components/native';
import { GlassView } from 'expo-glass-effect';
import { withAlpha } from '@lib/colors';
import { Text } from '@ui';

export const Label = styled(Text)<{ $isActive: boolean; $tintColor: string }>`
	color: ${({ theme, $isActive, $tintColor }) => ($isActive ? $tintColor : theme.text.primary)};
`;

export const InnerChip = styled.Pressable<{ $isActive: boolean; $tintColor: string }>`
	padding: 10px 14px;
	background-color: ${({ $isActive, $tintColor }) => ($isActive ? withAlpha($tintColor, 0.22) : 'transparent')};
`;

export const Chip = styled(GlassView).attrs({
	isInteractive: true
})`
	overflow: hidden;
	border-radius: 999px;
`;

export default styled.View`
	flex-direction: row;
	flex-wrap: wrap;
	gap: 8px;

	margin-bottom: 28px;
`;
