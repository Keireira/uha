import styled from 'styled-components/native';
import { GlassView } from 'expo-glass-effect';
import { withAlpha } from '@lib/colors';

/* ─── Sections ──────────────────────────────────────── */

export const Section = styled.View`
	gap: 8px;
`;

export const SectionLabel = styled.Text`
	font-family: 'Nunito';
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
	font-family: 'Nunito';
	font-size: 17px;
	font-weight: 700;

	color: ${({ $tone }) => $tone};
`;

export const TypeHeroDescription = styled.Text`
	font-family: 'Nunito';
	font-size: 13px;
	font-weight: 400;

	color: ${({ theme }) => theme.text.secondary};
`;

/* ─── Type picker (when picking new event type) ────── */

export const TypePickerGrid = styled.View`
	flex-direction: row;
	flex-wrap: wrap;
	gap: 8px;
`;

export const TypeChipWrap = styled(GlassView).attrs({
	isInteractive: true
})`
	overflow: hidden;
	border-radius: 20px;
`;

export const TypeChip = styled.Pressable<{ $tone: string }>`
	flex-direction: row;
	align-items: center;
	gap: 6px;

	padding: 10px 14px;

	background-color: ${({ $tone }) => withAlpha($tone, 0.16)};
	border-radius: 20px;
`;

export const TypeChipLabel = styled.Text<{ $tone: string }>`
	font-family: 'Nunito';
	font-size: 14px;
	font-weight: 600;

	color: ${({ $tone }) => $tone};
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
	font-family: 'Nunito';
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
	font-family: 'Nunito';
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

	font-family: 'Nunito';
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
	font-family: 'Nunito';
	font-size: 15px;
	font-weight: 400;
	line-height: 21px;

	min-height: 72px;

	padding: 12px 16px;

	color: ${({ theme }) => theme.text.primary};
`;

/* ─── Duration stepper (for trial) ─────────────────── */

export const DurationBlock = styled.View`
	flex-direction: row;
	align-items: center;
	justify-content: center;
	gap: 12px;

	padding: 18px 16px;
`;

export const StepperButton = styled(GlassView).attrs({
	isInteractive: true
})`
	overflow: hidden;
	border-radius: 22px;
`;

export const StepperPressable = styled.Pressable<{ $disabled: boolean }>`
	width: 44px;
	height: 44px;
	align-items: center;
	justify-content: center;

	background-color: ${({ theme }) => withAlpha(theme.text.tertiary, 0.1)};
	opacity: ${({ $disabled }) => ($disabled ? 0.4 : 1)};
`;

export const DurationValue = styled.Text`
	font-family: 'Nunito';
	font-size: 34px;
	font-weight: 700;

	color: ${({ theme }) => theme.text.primary};
	min-width: 56px;
	text-align: center;
`;

export const DurationUnit = styled.Text`
	font-family: 'Nunito';
	font-size: 17px;
	font-weight: 500;

	color: ${({ theme }) => theme.text.secondary};
`;

export const UnitRow = styled.View`
	flex-direction: row;
	align-self: stretch;
	gap: 8px;

	padding: 0 16px 16px;
`;

export const UnitChipWrap = styled(GlassView).attrs({
	isInteractive: true
})`
	flex: 1;
	overflow: hidden;
	border-radius: 16px;
`;

export const UnitChip = styled.Pressable<{ $active: boolean; $accent: string }>`
	align-items: center;
	justify-content: center;
	padding: 10px 0;

	background-color: ${({ $active, $accent }) => ($active ? withAlpha($accent, 0.18) : 'transparent')};
`;

export const UnitLabel = styled.Text<{ $active: boolean; $accent: string }>`
	font-family: 'Nunito';
	font-size: 14px;
	font-weight: 600;

	text-transform: capitalize;

	color: ${({ $active, $accent, theme }) => ($active ? $accent : theme.text.secondary)};
`;

/* ─── Actions ──────────────────────────────────────── */

export const Actions = styled.View`
	flex-direction: row;
	align-items: stretch;
	gap: 8px;

	margin-top: 8px;
`;

export const PrimaryButton = styled.Pressable<{ $accent: string; $disabled: boolean }>`
	flex: 1;
	flex-direction: row;
	align-items: center;
	justify-content: center;
	gap: 6px;

	height: 44px;
	padding: 0 18px;
	border-radius: 14px;

	background-color: ${({ $accent, $disabled }) =>
		$disabled ? withAlpha($accent, 0.35) : $accent};
`;

export const PrimaryLabel = styled.Text`
	font-family: 'Nunito';
	font-size: 15px;
	font-weight: 700;

	color: ${({ theme }) => theme.static.white};
`;

export const DeleteButton = styled.Pressable`
	width: 44px;
	height: 44px;
	align-items: center;
	justify-content: center;

	border-radius: 14px;
	background-color: ${({ theme }) => withAlpha(theme.semantic.error, 0.12)};
`;

export const DeleteLabel = styled.Text`
	font-family: 'Nunito';
	font-size: 13px;
	font-weight: 600;

	color: ${({ theme }) => theme.semantic.error};
`;

/* ─── Root ─────────────────────────────────────────── */

export default styled.ScrollView.attrs({
	showsVerticalScrollIndicator: false,
	contentInsetAdjustmentBehavior: 'automatic',
	keyboardDismissMode: 'on-drag',
	keyboardShouldPersistTaps: 'handled',
	contentContainerStyle: {
		padding: 16,
		gap: 20
	}
})`
	flex: 1;
	background-color: ${({ theme }) => theme.background.secondary};
`;
