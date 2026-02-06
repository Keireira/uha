import styled from 'styled-components/native';
import { ScrollView } from 'react-native';
import { GlassView } from 'expo-glass-effect';
import { H1, Text } from '@ui';

export const ScreenTitle = styled(H1)`
	font-size: 32px;
	font-weight: 800;
	letter-spacing: -0.5px;
`;

export const TabBar = styled(ScrollView).attrs({
	horizontal: true,
	showsHorizontalScrollIndicator: false,
	contentContainerStyle: {
		gap: 8,
		paddingHorizontal: 20
	}
})`
	margin-horizontal: -20px;
`;

export const TabGlass = styled(GlassView)<{ $active: boolean }>`
	border-radius: 20px;
	overflow: hidden;
	background-color: ${({ theme, $active }) => ($active ? `${theme.accent.primary}18` : 'transparent')};
	border-width: ${({ $active }) => ($active ? '0px' : '1px')};
	border-color: ${({ theme }) => `${theme.border.default}30`};
`;

export const TabInner = styled.Pressable`
	padding: 8px 18px;
`;

export const TabLabel = styled(Text)<{ $active: boolean }>`
	font-size: 14px;
	font-weight: ${({ $active }) => ($active ? '700' : '500')};
	color: ${({ theme, $active }) => ($active ? theme.text.primary : theme.text.secondary)};
`;

export default styled(ScrollView).attrs({
	contentContainerStyle: {
		gap: 24,
		paddingBottom: 40
	}
})`
	padding-horizontal: 20px;
`;
