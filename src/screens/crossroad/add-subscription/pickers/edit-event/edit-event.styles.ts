import styled from 'styled-components/native';
import { GlassView } from 'expo-glass-effect';
import { withAlpha } from '@lib/colors';

/* ─── Sections ──────────────────────────────────────── */

export const Section = styled.View`
	gap: 8px;
`;

export const SectionLabel = styled.Text`
	font-size: 13px;
	font-weight: 600;
	text-transform: uppercase;
	letter-spacing: 0.4px;

	padding: 0 4px;

	color: ${({ theme }) => theme.text.tertiary};
`;

/* ─── Hero / type display ──────────────────────────── */

export const TypeHero = styled.View<{ $tone: string }>`
	flex-direction: row;
	align-items: center;
	gap: 12px;

	padding: 14px 16px;

	background-color: ${({ $tone }) => withAlpha($tone, 0.14)};
	border-radius: 16px;
`;

export const TypeHeroIcon = styled.View<{ $tone: string }>`
	width: 36px;
	height: 36px;
	border-radius: 18px;

	align-items: center;
	justify-content: center;

	background-color: ${({ $tone }) => $tone};
`;

export const TypeHeroText = styled.View`
	flex: 1;
`;

export const TypeHeroLabel = styled.Text<{ $tone: string }>`
	font-size: 17px;
	font-weight: 700;

	color: ${({ $tone }) => $tone};
`;

export const TypeHeroDescription = styled.Text`
	font-size: 13px;
	font-weight: 400;

	color: ${({ theme }) => theme.text.secondary};
`;

/* ─── Fields card ──────────────────────────────────── */

export const Card = styled(GlassView).attrs({
	isInteractive: false
})`
	align-self: stretch;
	overflow: hidden;

	border-radius: 16px;
`;

export const Row = styled.View<{ $isLast?: boolean }>`
	flex-direction: row;
	align-items: center;
	justify-content: space-between;
	gap: 12px;

	padding: 14px 16px;
	min-height: 52px;

	border-bottom-width: ${({ $isLast }) => ($isLast ? 0 : 1)}px;
	border-bottom-color: ${({ theme }) => withAlpha(theme.text.tertiary, 0.15)};
`;

export const RowLabel = styled.Text`
	font-size: 16px;
	font-weight: 500;

	color: ${({ theme }) => theme.text.primary};
`;

export const AmountWrap = styled.View`
	flex: 1;
	flex-direction: row;
	align-items: center;
	justify-content: flex-end;
	gap: 6px;

	min-height: 28px;
`;

export const CurrencyBadge = styled.Text`
	font-size: 13px;
	font-weight: 600;

	color: ${({ theme }) => theme.text.tertiary};
`;

export const WarningRow = styled.View`
	flex-direction: row;
	align-items: center;
	gap: 8px;

	padding: 10px 12px;
	margin: 0 4px;

	border-radius: 10px;
	background-color: ${({ theme }) => withAlpha(theme.accents.orange, 0.12)};
`;

export const WarningText = styled.Text`
	flex: 1;

	font-size: 13px;
	font-weight: 500;
	line-height: 17px;

	color: ${({ theme }) => theme.accents.orange};
`;

export const ReasonField = styled.TextInput.attrs(({ theme }) => ({
	placeholderTextColor: theme.text.tertiary,
	multiline: true,
	textAlignVertical: 'top' as const
}))`
	font-size: 15px;
	font-weight: 400;
	line-height: 21px;

	min-height: 72px;

	padding: 12px 16px;

	color: ${({ theme }) => theme.text.primary};
`;

/* ─── Root ─────────────────────────────────────────── */

export default styled.ScrollView.attrs({
	showsVerticalScrollIndicator: false,
	contentInsetAdjustmentBehavior: 'automatic',
	keyboardDismissMode: 'on-drag',
	keyboardShouldPersistTaps: 'handled',
	contentContainerStyle: {
		padding: 16,
		paddingBottom: 64,
		gap: 20
	}
})`
	flex: 1;
	background-color: ${({ theme }) => theme.background.secondary};
`;
