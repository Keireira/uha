import styled from 'styled-components/native';
import { BaseText } from '@ui';

/* Root */

export default styled.ScrollView.attrs({
	contentContainerStyle: {
		flexDirection: 'row',
		alignItems: 'stretch',
		paddingTop: 48,
		paddingRight: 24,
		paddingBottom: 36,
		paddingLeft: 20
	}
})`
	flex: 1;
`;

/*Accent Rail */

export const AccentRail = styled.View`
	width: 6px;
	border-radius: 3px;
	overflow: hidden;
`;

export const AccentSegment = styled.View<{ $color?: string }>`
	flex: 1;
	background-color: ${({ $color, theme }) => $color || theme.accent.primary};
	opacity: 0.85;
`;

export const Content = styled.View`
	flex: 1;
	flex-direction: column;
	padding-left: 24px;
	padding-vertical: 20px;
`;

/* Price section */

export const PriceSection = styled.View`
	flex-direction: column;
	align-items: flex-start;
	margin-bottom: 12px;
`;

export const PriceMain = styled(BaseText)`
	font-size: 38px;
	font-weight: 800;
	color: ${({ theme }) => theme.text.primary};
	line-height: 44px;
`;

export const PriceConverted = styled(BaseText)`
	font-size: 18px;
	font-weight: 500;
	color: ${({ theme }) => theme.text.tertiary};
	margin-top: 6px;
`;

/* Horizontal Rule */

export const Rule = styled.View`
	height: 1px;
	width: 100%;
	background-color: ${({ theme }) => theme.border.default};
	opacity: 0.25;
	margin-vertical: 24px;
`;

/* Merchant section */

export const MerchantSection = styled.View`
	flex-direction: row;
	align-items: center;
	gap: 16px;
`;

export const MerchantInfo = styled.View`
	flex: 1;
	flex-direction: column;
	gap: 4px;
`;

export const MerchantName = styled(BaseText)`
	font-size: 22px;
	font-weight: 700;
	color: ${({ theme }) => theme.text.primary};
`;

export const DateRow = styled.View`
	flex-direction: row;
	align-items: center;
	gap: 6px;
`;

export const DateText = styled(BaseText)`
	font-size: 14px;
	font-weight: 400;
	color: ${({ theme }) => theme.text.secondary};
`;

/* Swiss Label */

export const Label = styled(BaseText)`
	font-size: 11px;
	font-weight: 700;
	letter-spacing: 2px;
	text-transform: uppercase;
	color: ${({ theme }) => theme.text.tertiary};
`;

/* Metadata Grid */

export const MetaGrid = styled.View`
	flex-direction: row;
	flex-wrap: wrap;
	gap: 32px;
`;

export const MetaItem = styled.View`
	flex-direction: column;
	gap: 6px;
	min-width: 100px;
`;

export const MetaValue = styled(BaseText)<{ $color?: string }>`
	font-size: 16px;
	font-weight: 600;
	color: ${({ $color, theme }) => $color || theme.text.primary};
`;

/* Tender / Payment section */

export const TenderRow = styled.View`
	flex-direction: row;
	align-items: center;
	gap: 12px;
`;

export const TenderEmoji = styled(BaseText)`
	font-size: 22px;
`;

export const TenderDetails = styled.View`
	flex-direction: column;
	gap: 2px;
`;

export const TenderComment = styled(BaseText)`
	font-size: 14px;
	font-weight: 400;
	color: ${({ theme }) => theme.text.secondary};
`;

/* Notes section */

export const NoteText = styled(BaseText)`
	font-size: 15px;
	font-weight: 400;
	line-height: 22px;
	color: ${({ theme }) => theme.text.secondary};
`;
