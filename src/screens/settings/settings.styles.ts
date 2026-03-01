import styled from 'styled-components/native';
import Animated from 'react-native-reanimated';
import { GlassView } from 'expo-glass-effect';
import { BaseText } from '@ui';

export const Container = styled.ScrollView.attrs({
	showsVerticalScrollIndicator: false,
	keyboardShouldPersistTaps: 'handled' as const
})`
	flex: 1;
	background-color: ${({ theme }) => theme.background.default};
`;

/* Hero hint */
export const LogoHint = styled(BaseText)`
	font-size: 12px;
	font-weight: 500;
	color: ${({ theme }) => theme.text.tertiary};
	text-align: center;
	margin-top: -4px;
	margin-bottom: 36px;
`;

/* Shared */
export const SectionWrap = styled.View`
	margin-bottom: 20px;
	padding-horizontal: 16px;
`;

export const SectionLabel = styled(BaseText)`
	font-size: 11px;
	font-weight: 600;
	color: ${({ theme }) => theme.text.tertiary};
	letter-spacing: 0.5px;
	text-transform: uppercase;
	margin-bottom: 10px;
	margin-left: 4px;
`;

export const SectionCard = styled(GlassView)`
	border-radius: 20px;
	overflow: hidden;
	padding: 12px;
`;

export const SectionFooterText = styled(BaseText)`
	font-size: 12px;
	font-weight: 400;
	color: ${({ theme }) => theme.text.tertiary};
	margin-left: 4px;
	margin-right: 4px;
	margin-top: 10px;
	line-height: 17px;
`;

/* Currency tiles */
export const CurrencyRow = styled.View`
	flex-direction: row;
	gap: 10px;
`;

export const CurrencyTile = styled(GlassView)`
	flex: 1;
	border-radius: 16px;
	overflow: hidden;
`;

export const CurrencyTileInner = styled.Pressable`
	padding: 16px;
	gap: 4px;
`;

export const CurrencyTileLabel = styled(BaseText)`
	font-size: 12px;
	font-weight: 600;
	color: ${({ theme }) => theme.text.tertiary};
	letter-spacing: 0.2px;
`;

export const CurrencyTileCode = styled(BaseText)`
	font-size: 28px;
	font-weight: 800;
	letter-spacing: -0.5px;
	color: ${({ theme }) => theme.text.primary};
	margin-top: 2px;
`;

export const CurrencyTileName = styled(BaseText)`
	font-size: 13px;
	font-weight: 400;
	color: ${({ theme }) => theme.text.secondary};
	margin-top: 2px;
`;

export const RefreshButton = styled(GlassView)`
	border-radius: 14px;
	overflow: hidden;
	margin-top: 10px;
`;

export const RefreshInner = styled.Pressable`
	flex-direction: row;
	align-items: center;
	justify-content: center;
	padding: 13px 20px;
	gap: 8px;
`;

export const RefreshText = styled(BaseText)`
	font-size: 15px;
	font-weight: 600;
	color: ${({ theme }) => theme.accent.orange};
`;

/* Tile grid (for toggle pairs, nav pairs) */
export const TileGrid = styled.View`
	flex-direction: row;
	flex-wrap: wrap;
	gap: 10px;
`;

export const NavTile = styled(GlassView)`
	flex-basis: 48%;
	flex-grow: 1;
	border-radius: 16px;
	overflow: hidden;
`;

export const NavTileInner = styled.Pressable`
	padding: 16px;
	gap: 4px;
`;

export const NavTileTitle = styled(BaseText)`
	font-size: 15px;
	font-weight: 600;
	color: ${({ theme }) => theme.text.primary};
`;

export const NavTileValue = styled(BaseText)`
	font-size: 13px;
	font-weight: 400;
	color: ${({ theme }) => theme.text.secondary};
`;

/* Glass card with rows */
export const Card = styled(GlassView)`
	border-radius: 16px;
	overflow: hidden;
`;

export const CardRow = styled.Pressable`
	flex-direction: row;
	align-items: center;
	justify-content: space-between;
	padding: 14px 16px;
	gap: 12px;
`;

export const CardRowTitle = styled(BaseText)`
	font-size: 16px;
	font-weight: 500;
	color: ${({ theme }) => theme.text.primary};
	flex-shrink: 1;
`;

export const CardRowTrailing = styled.View`
	flex-direction: row;
	align-items: center;
	gap: 6px;
`;

export const CardRowValue = styled(BaseText)`
	font-size: 15px;
	font-weight: 400;
	color: ${({ theme }) => theme.text.tertiary};
`;

export const Separator = styled.View`
	height: 0.5px;
	margin-left: 16px;
	margin-right: 16px;
	background-color: ${({ theme }) => `${theme.border.default}30`};
`;

/* Theme picker */
export const ThemePickerRow = styled.View`
	flex-direction: row;
	gap: 10px;
`;

export const ThemePickerTile = styled(GlassView)<{ $bg: string; $active: boolean; $accent: string }>`
	flex: 1;
	border-radius: 16px;
	overflow: hidden;
	background-color: ${({ $bg }) => $bg};
	border-width: 2.5px;
	border-color: ${({ $active, $accent }) => ($active ? $accent : 'transparent')};
`;

export const ThemePickerTileInner = styled.Pressable`
	align-items: center;
	justify-content: center;
	padding: 16px 10px;
	gap: 10px;
`;

export const ThemePickerLabel = styled(BaseText)<{ $color: string }>`
	font-size: 13px;
	font-weight: 700;
	color: ${({ $color }) => $color};
`;

/* Accent spectrum — expanding bars */
export const AccentSpectrum = styled.View`
	margin-top: 14px;
	flex-direction: row;
	height: 40px;
	gap: 4px;
`;

export const AccentBarItem = styled(Animated.View)<{ $color: string; $active: boolean }>`
	height: 100%;
	border-radius: 10px;
	background-color: ${({ $color }) => $color};
	overflow: hidden;
	border-width: 2.5px;
	border-color: ${({ $active }) => ($active ? 'rgba(255,255,255,0.45)' : 'transparent')};
	shadow-color: ${({ $color }) => $color};
	shadow-offset: 0px 2px;
	shadow-opacity: ${({ $active }) => ($active ? 0.5 : 0)};
	shadow-radius: 6px;
	elevation: ${({ $active }) => ($active ? 6 : 0)};
`;

/* Support — accented glass pills */
export const SupportRow = styled.View`
	flex-direction: row;
	flex-wrap: wrap;
	gap: 8px;
`;

export const SupportPill = styled(GlassView)`
	border-radius: 14px;
	overflow: hidden;
	background-color: ${({ theme }) => `${theme.accent.orange}12`};
`;

export const SupportPillInner = styled.Pressable`
	flex-direction: row;
	align-items: center;
	padding: 12px 16px;
	gap: 8px;
`;

export const SupportPillTitle = styled(BaseText)`
	font-size: 14px;
	font-weight: 700;
	color: ${({ theme }) => theme.accent.orange};
`;

export const SupportPillSub = styled(BaseText)`
	font-size: 13px;
	font-weight: 400;
	color: ${({ theme }) => theme.text.secondary};
`;

/* Footer */
export const FooterWrap = styled.View`
	padding-horizontal: 16px;
	padding-top: 8px;
	padding-bottom: 16px;
	gap: 12px;
`;

export const FooterLinks = styled.View`
	flex-direction: row;
	flex-wrap: wrap;
	gap: 8px;
`;

export const FooterPill = styled(GlassView)`
	border-radius: 12px;
	overflow: hidden;
`;

export const FooterPillInner = styled.Pressable`
	flex-direction: row;
	align-items: center;
	padding: 9px 14px;
	gap: 5px;
`;

export const FooterPillText = styled(BaseText)`
	font-size: 13px;
	font-weight: 500;
	color: ${({ theme }) => theme.text.secondary};
`;

export const FooterVersion = styled(BaseText)`
	font-size: 12px;
	font-weight: 400;
	color: ${({ theme }) => theme.text.tertiary};
	margin-left: 4px;
`;

/* Constellation */
export const ConstellationWrap = styled.View`
	align-self: center;
	justify-content: center;
	width: 280px;
	height: 280px;
`;

export const ConstellationLine = styled.View`
	position: absolute;
	height: 1px;
	background-color: ${({ theme }) => `${theme.text.tertiary}15`};
	z-index: 1;
`;

export const ConstellationStar = styled(Animated.View)`
	position: absolute;
	z-index: 5;
`;

export const ConstellationDot = styled.View<{ $color: string }>`
	background-color: ${({ $color }) => `${$color}90`};
	shadow-color: ${({ $color }) => $color};
	shadow-offset: 0px 0px;
	shadow-opacity: 0.8;
	shadow-radius: 6px;
`;

export const ConstellationGlow = styled(Animated.View)`
	position: absolute;
	align-items: center;
	justify-content: center;
	z-index: 3;
`;

export const ConstellationRay = styled.View<{ $color: string }>`
	position: absolute;
	background-color: ${({ $color }) => `${$color}18`};
	border-radius: 999px;
`;

/* Preferences — first day hint */
export const DayHint = styled(BaseText)`
	font-size: 11px;
	font-weight: 500;
	color: ${({ theme }) => `${theme.text.tertiary}90`};
	margin-top: 2px;
`;

/* Preferences — stepper */
export const StepperWrap = styled.View`
	flex-direction: row;
	align-items: center;
	gap: 6px;
	margin-top: 6px;
`;

export const StepperButton = styled.Pressable<{ $disabled: boolean }>`
	width: 28px;
	height: 28px;
	border-radius: 8px;
	align-items: center;
	justify-content: center;
	background-color: ${({ theme }) => `${theme.text.tertiary}12`};
	opacity: ${({ $disabled }) => ($disabled ? 0.35 : 1)};
`;

export const StepperValue = styled(BaseText)`
	font-size: 17px;
	font-weight: 700;
	color: ${({ theme }) => theme.text.primary};
	min-width: 20px;
	text-align: center;
`;

/* Preferences — color grading preview */
export const ColorGradingPreview = styled.View`
	flex-direction: row;
	align-items: center;
	gap: 4px;
	margin-top: 4px;
`;

export const ColorDot = styled.View<{ $color: string; $size: number }>`
	width: ${({ $size }) => $size}px;
	height: ${({ $size }) => $size}px;
	border-radius: ${({ $size }) => $size / 2}px;
	background-color: ${({ $color }) => $color};
`;

/* Section divider */
export const SectionDivider = styled.View`
	height: 0.5px;
	margin-horizontal: 40px;
	margin-vertical: 8px;
	background-color: ${({ theme }) => `${theme.border.default}25`};
`;

/* Upgrade banner */
export const UpgradeBanner = styled(GlassView)`
	border-radius: 20px;
	overflow: hidden;
	background-color: ${({ theme }) => `${theme.accent.orange}10`};
	border-width: 1px;
	border-color: ${({ theme }) => `${theme.accent.orange}30`};
`;

export const UpgradeBannerInner = styled.Pressable`
	flex-direction: row;
	align-items: center;
	padding: 16px;
	gap: 12px;
`;

export const UpgradeBannerText = styled.View`
	flex: 1;
	gap: 2px;
`;

export const UpgradeBannerTitle = styled(BaseText)`
	font-size: 16px;
	font-weight: 700;
	color: ${({ theme }) => theme.accent.orange};
`;

export const UpgradeBannerSub = styled(BaseText)`
	font-size: 13px;
	font-weight: 400;
	color: ${({ theme }) => theme.text.secondary};
`;

/* Unlimited badge */
export const UnlimitedBadge = styled(GlassView)`
	border-radius: 20px;
	overflow: hidden;
	background-color: ${({ theme }) => `${theme.accent.orange}10`};
`;

export const UnlimitedBadgeInner = styled.View`
	flex-direction: row;
	align-items: center;
	padding: 16px;
	gap: 12px;
`;

export const UnlimitedBadgeText = styled.View`
	flex: 1;
	gap: 2px;
`;

export const UnlimitedBadgeTitle = styled(BaseText)`
	font-size: 16px;
	font-weight: 700;
	color: ${({ theme }) => theme.accent.orange};
`;

export const UnlimitedBadgeSub = styled(BaseText)`
	font-size: 13px;
	font-weight: 400;
	color: ${({ theme }) => theme.text.secondary};
`;
