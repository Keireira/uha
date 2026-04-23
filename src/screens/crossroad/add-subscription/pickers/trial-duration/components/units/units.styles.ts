import styled from 'styled-components/native';
import { GlassView } from 'expo-glass-effect';
import { withAlpha } from '@lib/colors';
import { H6 } from '@ui';

export const Label = styled(H6)<{ $active: boolean; $tintColor: string }>`
	text-align: center;
	text-transform: capitalize;
	color: ${({ theme, $active, $tintColor }) => ($active ? $tintColor : theme.text.primary)};
`;

export const InnerChip = styled.Pressable<{ $active: boolean; $tintColor: string }>`
	padding: 10px 14px;
	background-color: ${({ $active, $tintColor }) => ($active ? withAlpha($tintColor, 0.22) : 'transparent')};
`;

export const Chip = styled(GlassView).attrs({
	isInteractive: true
})`
	flex: 1;
	overflow: hidden;
	border-radius: 12px;
`;

export default styled.View`
	flex-direction: row;
	gap: 8px;
`;
