import styled from 'styled-components/native';
import { GlassView } from 'expo-glass-effect';
import { Text } from '@ui';
import { BlurView } from 'expo-blur';

export const ButtonStub = styled.View`
	width: 42px;
	height: 42px;
	min-width: 42px;
	min-height: 42px;
	align-items: center;
	justify-content: center;
`;

export const CountGlass = styled(GlassView)`
	border-radius: 10px;
	min-width: 24px;
	align-items: center;
	overflow: hidden;
	padding: 2px 9px;
	background-color: ${({ theme }) => theme.accent.orange};
`;

export const CountText = styled(Text)`
	font-size: 13px;
	font-weight: 800;
	color: ${({ theme }) => theme.text.inverse};
`;

export const TabGlass = styled(GlassView)<{ $active: boolean }>`
	border-radius: 20px;
	overflow: hidden;
	background-color: ${({ theme, $active }) => ($active ? `${theme.accent.orange}20` : 'transparent')};
	border-width: ${({ $active }) => ($active ? '0px' : '1px')};
	border-color: ${({ theme }) => `${theme.border.default}40`};
`;

export const TabInner = styled.Pressable`
	padding-horizontal: 16px;
	padding-vertical: 8px;
`;

export const TabLabel = styled(Text)<{ $active: boolean }>`
	font-size: 12px;
	font-weight: ${({ $active }) => ($active ? '700' : '500')};
	color: ${({ theme, $active }) => ($active ? theme.text.primary : theme.text.secondary)};
	letter-spacing: 0.2px;
`;

export const TabsBarRow = styled.ScrollView.attrs({
	horizontal: true,
	showsHorizontalScrollIndicator: false,
	contentContainerStyle: {
		gap: 6
	}
})`
	flex-grow: 0;
`;

export const Title = styled.View`
	flex-direction: row;
	align-items: center;
	gap: 10px;
`;

export const HeaderRow = styled.View`
	bottom: 8px;
	left: 0;
	right: 0;
	flex-direction: row;
	justify-content: space-between;
	align-items: center;
`;

export default styled(BlurView)`
	position: absolute;
	top: 0;
	left: 0;
	right: 0;
	z-index: 10;
	padding: 26px 18px 18px 18px;
	gap: 12px;
	flex-direction: column;
`;
