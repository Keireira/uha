import styled from 'styled-components/native';
import { GlassView } from 'expo-glass-effect';
import { withAlpha } from '@lib/colors';
import { SmallText } from '@ui';

export const Icon = styled.View<{ $tintColor: string }>`
	width: 48px;
	height: 48px;
	border-radius: 50%;
	align-items: center;
	justify-content: center;
	background-color: ${({ $tintColor }) => withAlpha($tintColor, 0.25)};
`;

export const Description = styled(SmallText)`
	color: ${({ theme }) => theme.text.secondary};
`;

export const TextBlock = styled.View`
	flex: 1;
	gap: 2px;
`;

export const InnerPressable = styled.Pressable`
	flex-direction: row;
	align-items: center;
	padding: 12px 14px;
	gap: 12px;
`;

export const Inner = styled.View`
	flex-direction: row;
	align-items: center;
	padding: 12px 14px;
	gap: 12px;
`;

export default styled(GlassView)`
	flex: 1;
	overflow: hidden;
	border-radius: 12px;
`;
