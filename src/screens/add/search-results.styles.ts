import styled from 'styled-components/native';
import { BlurView } from 'expo-blur';
import { GlassView } from 'expo-glass-effect';
import { BaseText, H6, SmallText } from '@ui';

/* ── Section ────────────────────────────── */

export const SectionWrap = styled.View`
	padding-horizontal: 16px;
	margin-bottom: 28px;
`;

export const SectionLabel = styled(H6)`
	font-size: 12px;
	color: ${({ theme }) => theme.text.tertiary};
	letter-spacing: 0.5px;
	text-transform: uppercase;
	margin-bottom: 10px;
	margin-left: 4px;
`;

export const SectionCard = styled(GlassView)`
	border-radius: 20px;
	overflow: hidden;
`;

export const SectionFooter = styled(SmallText)`
	color: ${({ theme }) => theme.text.tertiary};
	margin-top: 10px;
	margin-horizontal: 4px;
`;

/* ── Top hit ────────────────────────────── */

export const TopHitInner = styled.Pressable`
	flex-direction: row;
	align-items: center;
	gap: 16px;
	padding: 16px 20px;
`;

export const TopHitInfo = styled.View`
	flex: 1;
	gap: 3px;
`;

export const TopHitName = styled(BaseText)`
	font-size: 18px;
	font-weight: 700;
	color: ${({ theme }) => theme.text.primary};
`;

export const TopHitDomain = styled(BaseText)`
	font-size: 13px;
	font-weight: 400;
	color: ${({ theme }) => theme.text.tertiary};
`;

/* ── Regular row ────────────────────────── */

export const RowInner = styled.Pressable`
	flex-direction: row;
	align-items: center;
	gap: 14px;
	padding: 12px 20px;
`;

export const RowDivider = styled.View`
	height: 0.5px;
	background-color: ${({ theme }) => `${theme.border.default}15`};
	margin-left: 78px;
`;

/* ── Logo ────────────────────────────────── */

export const LogoGlass = styled(GlassView)<{ $size: number }>`
	width: ${({ $size }) => $size}px;
	height: ${({ $size }) => $size}px;
	border-radius: ${({ $size }) => Math.round($size * 0.28)}px;
	overflow: hidden;
	align-items: center;
	justify-content: center;
`;

export const LogoInner = styled(BlurView).attrs({ intensity: 30, tint: 'prominent' })`
	width: 100%;
	height: 100%;
	align-items: center;
	justify-content: center;
	background-color: ${({ theme }) => `${theme.surface.default}20`};
`;

export const LogoFallback = styled.View`
	width: 100%;
	height: 100%;
	align-items: center;
	justify-content: center;
	background-color: ${({ theme }) => `${theme.surface.default}40`};
`;

export const FallbackInitial = styled(BaseText)<{ $size: number }>`
	font-size: ${({ $size }) => Math.round($size * 0.38)}px;
	font-weight: 700;
	color: ${({ theme }) => theme.text.secondary};
`;

/* ── Text ────────────────────────────────── */

export const Info = styled.View`
	flex: 1;
	gap: 2px;
`;

export const ServiceName = styled(BaseText)`
	font-size: 15px;
	font-weight: 600;
	color: ${({ theme }) => theme.text.primary};
`;

export const Domain = styled(BaseText)`
	font-size: 12px;
	font-weight: 400;
	color: ${({ theme }) => theme.text.tertiary};
`;

/* ── Source badge ────────────────────────── */

export const BadgeGlass = styled(GlassView)`
	border-radius: 8px;
	overflow: hidden;
`;

export const BadgeInner = styled.View<{ $color: string }>`
	padding: 3px 8px;
	background-color: ${({ $color }) => `${$color}10`};
`;

export const BadgeLabel = styled(BaseText)<{ $color: string }>`
	font-size: 11px;
	font-weight: 600;
	color: ${({ $color }) => $color};
`;

/* ── States ─────────────────────────────── */

export const EmptyWrap = styled.View`
	padding-horizontal: 16px;
	padding-top: 40px;
`;

export const EmptyCard = styled(GlassView)`
	border-radius: 20px;
	overflow: hidden;
`;

export const EmptyInner = styled.View`
	align-items: center;
	justify-content: center;
	padding: 56px 20px;
	gap: 14px;
`;

export const EmptyText = styled(BaseText)`
	font-size: 15px;
	font-weight: 500;
	color: ${({ theme }) => theme.text.tertiary};
`;

export const LoadingContainer = styled.View`
	align-items: center;
	justify-content: center;
	padding-top: 80px;
`;
