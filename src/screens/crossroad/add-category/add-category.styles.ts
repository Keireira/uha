import styled from 'styled-components/native';
import { GlassView } from 'expo-glass-effect';
import { withAlpha } from '@lib/colors';

export const Screen = styled.View`
	flex: 1;
	background-color: ${({ theme }) => theme.background.secondary};
`;

export const PreviewRow = styled.View`
	flex-direction: row;
	align-items: center;
	justify-content: center;

	margin-bottom: 24px;
`;

export const PreviewBadge = styled.View<{ $color: string }>`
	width: 88px;
	height: 88px;
	border-radius: 44px;

	align-items: center;
	justify-content: center;

	background-color: ${({ $color }) => withAlpha($color, 0.22)};
`;

export const PreviewEmoji = styled.Text`
	font-size: 40px;
`;

export const PreviewPlaceholder = styled.Text`
	font-size: 28px;

	color: ${({ theme }) => theme.text.tertiary};
`;

export const Section = styled.View`
	margin-bottom: 20px;
`;

export const SectionHeader = styled.View`
	margin-bottom: 10px;
`;

export const SectionTitle = styled.Text`
	font-size: 13px;
	font-weight: 600;
	text-transform: uppercase;
	letter-spacing: 0.4px;

	color: ${({ theme }) => theme.text.tertiary};

	padding-horizontal: 4px;
`;

export const Card = styled(GlassView).attrs({
	isInteractive: false
})`
	overflow: hidden;
	border-radius: 14px;
`;

export const FieldPad = styled.View`
	padding: 4px 12px;
`;

export const EmojiField = styled.TextInput.attrs(({ theme }) => ({
	placeholderTextColor: theme.text.tertiary,
	autoCorrect: false,
	autoCapitalize: 'none'
}))`
	font-size: 32px;
	font-weight: 600;

	text-align: center;

	padding: 12px;

	color: ${({ theme }) => theme.text.primary};
`;

export const ColorGrid = styled.View`
	flex-direction: row;
	flex-wrap: wrap;
	gap: 10px;
`;

export const ColorSwatchWrap = styled.Pressable<{ $active: boolean; $color: string }>`
	width: 40px;
	height: 40px;
	border-radius: 20px;

	align-items: center;
	justify-content: center;

	background-color: ${({ $color }) => $color};

	${({ $active, $color }) => ($active ? `border-width: 3px; border-color: ${withAlpha($color, 1)};` : '')}
`;

export const ColorSwatchInner = styled.View<{ $active: boolean }>`
	width: ${({ $active }) => ($active ? '28px' : '40px')};
	height: ${({ $active }) => ($active ? '28px' : '40px')};
	border-radius: ${({ $active }) => ($active ? '14px' : '20px')};

	background-color: transparent;
`;

export default styled.ScrollView.attrs({
	showsVerticalScrollIndicator: false,
	keyboardShouldPersistTaps: 'handled',
	keyboardDismissMode: 'on-drag',
	contentContainerStyle: { padding: 20, paddingBottom: 32 }
})`
	background-color: ${({ theme }) => theme.background.secondary};
`;
