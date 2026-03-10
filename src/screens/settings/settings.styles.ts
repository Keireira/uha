import styled from 'styled-components/native';
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

export const SectionCard = styled(GlassView).attrs({
	glassEffectStyle: 'clear'
})`
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
export const Row = styled.View`
	flex-direction: row;
	gap: 10px;
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

/* Support — accented glass pills */
export const SupportRow = styled.View`
	flex-direction: row;
	flex-wrap: wrap;
	gap: 8px;
`;

export const SupportPill = styled(GlassView)`
	border-radius: 14px;
	overflow: hidden;
	background-color: ${({ theme }) => `${theme.accents.orange}12`};
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
	color: ${({ theme }) => theme.accents.orange};
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

/* Section divider */
export const SectionDivider = styled.View`
	height: 0.5px;
	margin-horizontal: 40px;
	margin-vertical: 8px;
	background-color: ${({ theme }) => `${theme.border.default}25`};
`;
