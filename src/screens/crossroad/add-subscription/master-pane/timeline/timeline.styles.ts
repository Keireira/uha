import styled from 'styled-components/native';
import { GlassView } from 'expo-glass-effect';
import { withAlpha } from '@lib/colors';

export const Header = styled.View`
	flex-direction: row;
	align-items: center;
	justify-content: space-between;

	padding: 0 4px;
	margin-bottom: 8px;
`;

export const Title = styled.Text`
	font-family: 'Nunito';
	font-size: 13px;
	font-weight: 600;
	text-transform: uppercase;
	letter-spacing: 0.4px;

	color: ${({ theme }) => theme.text.tertiary};
`;

export const HeaderHint = styled.Text`
	font-family: 'Nunito';
	font-size: 12px;
	font-weight: 500;

	color: ${({ theme }) => theme.text.tertiary};
`;

/* ─── Validation banner ──────────────────────────────────── */

export const ErrorBanner = styled.View`
	flex-direction: row;
	align-items: flex-start;
	gap: 10px;

	padding: 12px 14px;
	margin-top: 10px;

	border-radius: 12px;
	background-color: ${({ theme }) => withAlpha(theme.semantic.error, 0.12)};
`;

export const ErrorTextBlock = styled.View`
	flex: 1;
	gap: 2px;
`;

export const ErrorLine = styled.Text`
	font-family: 'Nunito';
	font-size: 13px;
	font-weight: 500;
	line-height: 17px;

	color: ${({ theme }) => theme.semantic.error};
`;

/* ─── Timeline rail ─────────────────────────────────────── */

export const Card = styled(GlassView).attrs({
	isInteractive: false
})`
	align-self: stretch;
	overflow: hidden;

	border-radius: 16px;
`;

export const SwipeWrap = styled.View`
	overflow: hidden;
`;

export const EventRow = styled.Pressable`
	flex-direction: row;
	align-items: stretch;

	padding: 14px 16px;

	background-color: ${({ theme }) => theme.background.secondary};
`;

export const Rail = styled.View`
	width: 28px;
	align-items: center;
	justify-content: center;

	margin-right: 10px;
`;

export const Connector = styled.View<{ $above: boolean; $below: boolean }>`
	position: absolute;
	top: ${({ $above }) => ($above ? -14 : 14)}px;
	bottom: ${({ $below }) => ($below ? -14 : 14)}px;
	width: 2px;

	background-color: ${({ theme, $above, $below }) =>
		$above || $below ? withAlpha(theme.text.tertiary, 0.22) : 'transparent'};
`;

export const NodeBubble = styled.View<{ $tone: string }>`
	width: 28px;
	height: 28px;
	border-radius: 14px;

	align-items: center;
	justify-content: center;

	background-color: ${({ $tone }) => withAlpha($tone, 0.2)};

	z-index: 1;
`;

export const NodeCore = styled.View<{ $tone: string }>`
	width: 20px;
	height: 20px;
	border-radius: 10px;

	align-items: center;
	justify-content: center;

	background-color: ${({ $tone }) => $tone};
`;

/* ─── Event content ─────────────────────────────────────── */

export const EventBody = styled.View`
	flex: 1;
	gap: 4px;

	min-height: 28px;
	justify-content: center;
`;

export const EventMeta = styled.View`
	flex-direction: row;
	align-items: center;
	gap: 4px;

	margin-left: 8px;
`;

export const EventLabel = styled.Text<{ $tone: string }>`
	font-family: 'Nunito';
	font-size: 15px;
	font-weight: 700;

	color: ${({ $tone }) => $tone};
`;

export const EventDate = styled.Text`
	font-family: 'Nunito';
	font-size: 13px;
	font-weight: 500;

	color: ${({ theme }) => theme.text.tertiary};
`;

export const EventSummary = styled.Text`
	font-family: 'Nunito';
	font-size: 15px;
	font-weight: 600;

	color: ${({ theme }) => theme.text.primary};
`;

export const Chevron = styled.View`
	align-items: center;
	justify-content: center;
`;

/* ─── Delete action ─────────────────────────────────────── */

export const DeleteAction = styled.Pressable`
	width: 88px;
	align-items: center;
	justify-content: center;

	background-color: ${({ theme }) => theme.semantic.error};
`;

export const DeleteActionLabel = styled.Text`
	font-family: 'Nunito';
	font-size: 14px;
	font-weight: 600;

	color: ${({ theme }) => theme.static.white};

	margin-top: 4px;
`;

/* ─── Add button ────────────────────────────────────────── */

export const AddButton = styled(GlassView).attrs({
	isInteractive: true
})`
	align-self: stretch;
	overflow: hidden;

	border-radius: 14px;

	margin-top: 10px;
`;

export const AddPressable = styled.Pressable<{ $accent: string }>`
	flex-direction: row;
	align-items: center;
	justify-content: center;
	gap: 8px;

	padding: 14px 16px;

	background-color: ${({ $accent }) => withAlpha($accent, 0.14)};
`;

export const AddLabel = styled.Text<{ $accent: string }>`
	font-family: 'Nunito';
	font-size: 15px;
	font-weight: 600;

	color: ${({ $accent }) => $accent};
`;

/* ─── Empty state ───────────────────────────────────────── */

export const EmptyState = styled.View`
	align-items: center;
	justify-content: center;
	gap: 8px;

	padding: 28px 20px;
`;

export const EmptyText = styled.Text`
	font-family: 'Nunito';
	font-size: 14px;
	font-weight: 500;

	text-align: center;
	color: ${({ theme }) => theme.text.secondary};
`;

export const EmptyHint = styled.Text`
	font-family: 'Nunito';
	font-size: 12px;
	font-weight: 400;

	text-align: center;
	color: ${({ theme }) => theme.text.tertiary};
`;

export default styled.View`
	align-self: stretch;
`;

/* ─── Type picker sheet (inline chips) ──────────────────── */

export const TypePickerBackdrop = styled.Pressable`
	position: absolute;
	top: 0;
	left: 0;
	right: 0;
	bottom: 0;

	background-color: rgba(0, 0, 0, 0.5);
	justify-content: flex-end;
`;

export const TypePickerSheet = styled(GlassView).attrs({
	isInteractive: false
})`
	padding: 20px 16px 28px;
	gap: 12px;

	border-top-left-radius: 24px;
	border-top-right-radius: 24px;
	overflow: hidden;
`;

export const TypePickerTitle = styled.Text`
	font-family: 'Nunito';
	font-size: 13px;
	font-weight: 600;
	text-transform: uppercase;
	letter-spacing: 0.4px;
	text-align: center;

	color: ${({ theme }) => theme.text.tertiary};

	margin-bottom: 4px;
`;

export const TypeChipGrid = styled.View`
	flex-direction: row;
	flex-wrap: wrap;
	gap: 8px;

	justify-content: center;
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
