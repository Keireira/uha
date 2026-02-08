import styled from 'styled-components/native';
import { GlassView } from 'expo-glass-effect';
import { BaseText } from '@ui';

export const Container = styled.ScrollView.attrs({
	keyboardShouldPersistTaps: 'handled' as const,
	showsVerticalScrollIndicator: false
})`
	flex: 1;
`;

export const Header = styled.View`
	flex-direction: row;
	align-items: center;
	justify-content: space-between;
`;

export const Title = styled(BaseText)<{ $dark: boolean }>`
	font-size: 22px;
	font-weight: 700;
	color: ${({ $dark }) => ($dark ? '#333333' : '#ffffff')};
`;

export const CloseGlass = styled(GlassView)`
	width: 48px;
	height: 48px;
	border-radius: 24px;
	overflow: hidden;
`;

export const CloseInner = styled.Pressable`
	width: 100%;
	height: 100%;
	align-items: center;
	justify-content: center;
`;

export const Preview = styled.View<{ $bg: string }>`
	align-self: center;
	width: 128px;
	height: 128px;
	align-items: center;
	justify-content: center;
	border-radius: 38px;
	background-color: ${({ $bg }) => $bg};
`;

export const PreviewInitial = styled(BaseText)<{ $dark: boolean }>`
	font-size: 48px;
	font-weight: 700;
	color: ${({ $dark }) => ($dark ? '#333333' : '#ffffff')};
`;

export const NameInput = styled.TextInput<{ $dark: boolean }>`
	font-family: 'Nunito';
	font-size: 24px;
	font-weight: 700;
	text-align: center;
	padding: 0;
	color: ${({ $dark }) => ($dark ? '#333333' : '#ffffff')};
	background-color: transparent;
`;

export const Main = styled.View`
	gap: 36px;
`;

export const Section = styled.View`
	gap: 10px;
`;

export const Caption = styled(BaseText)<{ $dark: boolean }>`
	font-size: 14px;
	font-weight: 600;
	text-transform: uppercase;
	letter-spacing: 1px;
	color: ${({ $dark }) => ($dark ? '#333333' : '#ffffff')};
	opacity: 0.8;
`;

export const CategoryOption = styled.Pressable<{ $selected: boolean }>`
	flex-direction: row;
	align-items: center;
	gap: 10px;
	padding: 10px 14px;
	border-radius: 10px;
	background-color: ${({ $selected }) => ($selected ? 'rgba(255,255,255,0.3)' : 'rgba(255,255,255,0.12)')};
`;

export const CategoryEmoji = styled(BaseText)`
	font-size: 20px;
`;

export const CategoryLabel = styled(BaseText)<{ $dark: boolean; $selected: boolean }>`
	font-size: 14px;
	font-weight: ${({ $selected }) => ($selected ? '700' : '500')};
	color: ${({ $dark }) => ($dark ? '#333333' : '#ffffff')};
	opacity: ${({ $selected }) => ($selected ? 1 : 0.7)};
`;

export const CategoriesList = styled.View`
	flex-direction: row;
	flex-wrap: wrap;
	gap: 8px;
`;

export const PlaceholderText = styled(BaseText)<{ $dark: boolean }>`
	font-size: 15px;
	color: ${({ $dark }) => ($dark ? '#333333' : '#ffffff')};
	opacity: 0.5;
`;

export const SearchInput = styled.TextInput`
	font-family: 'Nunito';
	font-size: 16px;
	padding: 12px 16px;
	border-radius: 12px;
	color: ${({ theme }) => theme.text.primary};
	background-color: ${({ theme }) => theme.surface.default};
`;

export const ResultItem = styled.Pressable`
	flex-direction: row;
	align-items: center;
	gap: 12px;
	padding: 10px 0;
`;

export const ResultTitle = styled(BaseText)`
	font-size: 15px;
	font-weight: 600;
	color: ${({ theme }) => theme.text.primary};
`;

export const ResultSubtitle = styled(BaseText)`
	font-size: 12px;
	color: ${({ theme }) => theme.text.tertiary};
`;

export const CreateButton = styled.Pressable`
	flex-direction: row;
	align-items: center;
	gap: 8px;
	padding: 14px 16px;
	border-radius: 12px;
	background-color: ${({ theme }) => `${theme.accent.primary}15`};
	margin-top: 4px;
`;

export const CreateButtonLabel = styled(BaseText)`
	font-size: 15px;
	font-weight: 600;
	color: ${({ theme }) => theme.accent.primary};
`;

export const Divider = styled.View`
	height: 1px;
	background-color: ${({ theme }) => `${theme.border.default}30`};
	margin-vertical: 4px;
`;

export const SaveButton = styled.Pressable<{ $disabled: boolean }>`
	height: 52px;
	border-radius: 14px;
	align-items: center;
	justify-content: center;
	background-color: rgba(255, 255, 255, 0.2);
	opacity: ${({ $disabled }) => ($disabled ? 0.35 : 1)};
`;

export const SaveLabel = styled(BaseText)<{ $dark: boolean }>`
	font-size: 17px;
	font-weight: 700;
	color: ${({ $dark }) => ($dark ? '#333333' : '#ffffff')};
`;
