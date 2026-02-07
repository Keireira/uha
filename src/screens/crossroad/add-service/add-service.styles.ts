import styled from 'styled-components/native';
import { GlassView } from 'expo-glass-effect';
import { BaseText } from '@ui';

export const Container = styled.ScrollView.attrs({
	contentContainerStyle: {
		paddingHorizontal: 24,
		gap: 24
	},
	keyboardShouldPersistTaps: 'handled' as const,
	showsVerticalScrollIndicator: false
})``;

export const Header = styled.View`
	flex-direction: row;
	align-items: center;
	justify-content: space-between;
	margin-top: 32px;
`;

export const Title = styled(BaseText)`
	font-size: 22px;
	font-weight: 700;
	color: ${({ theme }) => theme.text.primary};
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

export const FieldLabel = styled(BaseText)`
	font-size: 11px;
	font-weight: 600;
	text-transform: uppercase;
	color: ${({ theme }) => theme.text.secondary};
	margin-bottom: 8px;
`;

export const Field = styled.View``;

export const Input = styled.TextInput`
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

export const CategoryOption = styled.Pressable<{ $selected: boolean }>`
	flex-direction: row;
	align-items: center;
	gap: 10px;
	padding: 10px 14px;
	border-radius: 10px;
	background-color: ${({ theme, $selected }) => ($selected ? `${theme.accent.primary}20` : theme.surface.default)};
	border-width: ${({ $selected }) => ($selected ? '1px' : '0px')};
	border-color: ${({ theme }) => `${theme.accent.primary}40`};
`;

export const CategoryEmoji = styled(BaseText)`
	font-size: 20px;
`;

export const CategoryLabel = styled(BaseText)<{ $selected: boolean }>`
	font-size: 14px;
	font-weight: ${({ $selected }) => ($selected ? '700' : '500')};
	color: ${({ theme, $selected }) => ($selected ? theme.accent.primary : theme.text.primary)};
`;

export const CategoriesList = styled.View`
	flex-direction: row;
	flex-wrap: wrap;
	gap: 8px;
`;

export const PlaceholderText = styled(BaseText)`
	font-size: 15px;
	color: ${({ theme }) => theme.text.tertiary};
`;

export const EmojiPreview = styled.Pressable`
	flex-direction: row;
	align-items: center;
	gap: 12px;
	padding: 12px 16px;
	border-radius: 12px;
	background-color: ${({ theme }) => theme.surface.default};
`;

export const SaveButton = styled.Pressable<{ $disabled: boolean }>`
	height: 48px;
	border-radius: 14px;
	align-items: center;
	justify-content: center;
	background-color: ${({ theme }) => theme.accent.primary};
	opacity: ${({ $disabled }) => ($disabled ? 0.4 : 1)};
	margin-top: 8px;
`;

export const SaveLabel = styled(BaseText)`
	font-size: 16px;
	font-weight: 700;
	color: ${({ theme }) => theme.static.white};
`;

export const Divider = styled.View`
	height: 1px;
	background-color: ${({ theme }) => `${theme.border.default}30`};
	margin-vertical: 4px;
`;
