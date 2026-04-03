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

/* ── Service preview ────────────────────── */

export const ServicePreview = styled.View`
	align-items: center;
	gap: 10px;
`;

export const ServiceName = styled(BaseText)<{ $dark: boolean }>`
	font-size: 20px;
	font-weight: 700;
	color: ${({ $dark }) => ($dark ? '#333333' : '#ffffff')};
`;

/* ── Form ────────────────────────────────── */

export const Main = styled.View`
	gap: 28px;
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

/* ── Text input ─────────────────────────── */

export const Input = styled.TextInput<{ $dark: boolean }>`
	font-family: 'Nunito';
	font-size: 16px;
	padding: 12px 16px;
	border-radius: 12px;
	color: ${({ $dark }) => ($dark ? '#333333' : '#ffffff')};
	background-color: rgba(255, 255, 255, 0.1);
`;

/* ── Price ───────────────────────────────── */

export const PriceRow = styled.View`
	flex-direction: row;
	align-items: center;
	gap: 12px;
`;

export const PriceInput = styled.TextInput<{ $dark: boolean }>`
	font-family: 'Nunito';
	font-size: 32px;
	font-weight: 800;
	flex: 1;
	padding: 0;
	color: ${({ $dark }) => ($dark ? '#333333' : '#ffffff')};
	background-color: transparent;
`;

export const CurrencyPill = styled.Pressable`
	padding: 8px 14px;
	border-radius: 10px;
	background-color: rgba(255, 255, 255, 0.15);
`;

export const CurrencyText = styled(BaseText)<{ $dark: boolean }>`
	font-size: 16px;
	font-weight: 700;
	color: ${({ $dark }) => ($dark ? '#333333' : '#ffffff')};
`;

/* ── Cycle ───────────────────────────────── */

export const CycleRow = styled.View`
	flex-direction: row;
	align-items: center;
	gap: 8px;
`;

export const CycleValueInput = styled.TextInput<{ $dark: boolean }>`
	font-family: 'Nunito';
	font-size: 18px;
	font-weight: 700;
	width: 48px;
	text-align: center;
	padding: 8px 0;
	border-radius: 10px;
	color: ${({ $dark }) => ($dark ? '#333333' : '#ffffff')};
	background-color: rgba(255, 255, 255, 0.15);
`;

export const CycleOption = styled.Pressable<{ $selected: boolean }>`
	padding: 10px 14px;
	border-radius: 10px;
	background-color: ${({ $selected }) => ($selected ? 'rgba(255,255,255,0.3)' : 'rgba(255,255,255,0.12)')};
`;

export const CycleLabel = styled(BaseText)<{ $dark: boolean; $selected: boolean }>`
	font-size: 14px;
	font-weight: ${({ $selected }) => ($selected ? '700' : '500')};
	color: ${({ $dark }) => ($dark ? '#333333' : '#ffffff')};
	opacity: ${({ $selected }) => ($selected ? 1 : 0.7)};
`;

export const CycleHint = styled(BaseText)<{ $dark: boolean }>`
	font-size: 13px;
	font-weight: 500;
	color: ${({ $dark }) => ($dark ? '#333333' : '#ffffff')};
	opacity: 0.5;
`;

/* ── Pill options (category, tender) ────── */

export const PillList = styled.View`
	flex-direction: row;
	flex-wrap: wrap;
	gap: 8px;
`;

export const Pill = styled.Pressable<{ $selected: boolean }>`
	flex-direction: row;
	align-items: center;
	gap: 8px;
	padding: 8px 14px;
	border-radius: 10px;
	background-color: ${({ $selected }) => ($selected ? 'rgba(255,255,255,0.3)' : 'rgba(255,255,255,0.12)')};
`;

export const PillEmoji = styled(BaseText)`
	font-size: 16px;
`;

export const PillLabel = styled(BaseText)<{ $dark: boolean; $selected: boolean }>`
	font-size: 13px;
	font-weight: ${({ $selected }) => ($selected ? '700' : '500')};
	color: ${({ $dark }) => ($dark ? '#333333' : '#ffffff')};
	opacity: ${({ $selected }) => ($selected ? 1 : 0.7)};
`;

/* ── Tender (compact horizontal scroll) ─── */

export const TenderScroll = styled.ScrollView.attrs({
	horizontal: true,
	showsHorizontalScrollIndicator: false
})``;

export const TenderChip = styled.Pressable<{ $selected: boolean }>`
	flex-direction: row;
	align-items: center;
	gap: 6px;
	padding: 8px 12px;
	border-radius: 10px;
	margin-right: 8px;
	background-color: ${({ $selected }) => ($selected ? 'rgba(255,255,255,0.3)' : 'rgba(255,255,255,0.12)')};
`;

export const TenderEmoji = styled(BaseText)`
	font-size: 16px;
`;

export const TenderTitle = styled(BaseText)<{ $dark: boolean; $selected: boolean }>`
	font-size: 13px;
	font-weight: ${({ $selected }) => ($selected ? '700' : '500')};
	color: ${({ $dark }) => ($dark ? '#333333' : '#ffffff')};
	opacity: ${({ $selected }) => ($selected ? 1 : 0.7)};
`;

/* ── Date ────────────────────────────────── */

export const DateButton = styled.Pressable`
	flex-direction: row;
	align-items: center;
	gap: 10px;
	padding: 12px 16px;
	border-radius: 12px;
	background-color: rgba(255, 255, 255, 0.1);
`;

export const DateText = styled(BaseText)<{ $dark: boolean }>`
	font-size: 16px;
	font-weight: 600;
	color: ${({ $dark }) => ($dark ? '#333333' : '#ffffff')};
`;

/* ── Trial toggle ───────────────────────── */

export const TrialRow = styled.View`
	flex-direction: row;
	align-items: center;
	justify-content: space-between;
`;

export const TrialLabel = styled(BaseText)<{ $dark: boolean }>`
	font-size: 15px;
	font-weight: 600;
	color: ${({ $dark }) => ($dark ? '#333333' : '#ffffff')};
`;

export const TrialDaysRow = styled.View`
	flex-direction: row;
	align-items: center;
	gap: 10px;
	margin-top: 8px;
`;

export const TrialInput = styled.TextInput<{ $dark: boolean }>`
	font-family: 'Nunito';
	font-size: 18px;
	font-weight: 700;
	width: 56px;
	text-align: center;
	padding: 8px 0;
	border-radius: 10px;
	color: ${({ $dark }) => ($dark ? '#333333' : '#ffffff')};
	background-color: rgba(255, 255, 255, 0.15);
`;

export const TrialHint = styled(BaseText)<{ $dark: boolean }>`
	font-size: 13px;
	font-weight: 500;
	color: ${({ $dark }) => ($dark ? '#333333' : '#ffffff')};
	opacity: 0.5;
	flex: 1;
`;

/* ── Color dots ──────────────────────────── */

export const ColorDot = styled.Pressable<{ $color: string; $selected: boolean }>`
	width: 32px;
	height: 32px;
	border-radius: 16px;
	margin-right: 8px;
	background-color: ${({ $color }) => $color};
	border-width: ${({ $selected }) => ($selected ? '2.5px' : '0px')};
	border-color: rgba(255, 255, 255, 0.9);
`;

/* ── Save ────────────────────────────────── */

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

/* ── Loading ────────────────────────────── */

export const LoadingWrap = styled.View`
	flex: 1;
	align-items: center;
	justify-content: center;
`;
