import styled from 'styled-components/native';
import { SmallText, Text } from '@ui';

/* Commentary section */
export const NoteInput = styled.TextInput`
	font-family: 'Nunito';
	font-size: 15px;
	font-weight: 400;
	line-height: 22px;
	color: ${({ theme }) => theme.text.primary};
	padding: 0;
	margin: 0;
	min-height: 22px;
`;

/* Payment method section */
export const TenderComment = styled(Text).attrs({
	adjustsFontSizeToFit: true,
	minimumFontScale: 0.5
})`
	font-size: 14px;
	color: ${({ theme }) => theme.text.secondary};
`;

export const TenderDetails = styled.View`
	flex-direction: column;
	gap: 2px;
`;

export const TenderEmoji = styled(Text).attrs({
	numberOfLines: 1,
	ellipsizeMode: 'tail',
	adjustsFontSizeToFit: true,
	minimumFontScale: 0.66
})`
	font-size: 22px;
`;

export const TenderValue = styled.View`
	flex-direction: row;
	align-items: center;
	gap: 12px;
`;

/* Shared between sections */
export const MetaValue = styled(Text).attrs({
	numberOfLines: 1,
	ellipsizeMode: 'tail',
	adjustsFontSizeToFit: true,
	minimumFontScale: 0.5
})`
	font-weight: 600;
`;

export const Label = styled(SmallText).attrs({
	numberOfLines: 1,
	ellipsizeMode: 'tail',
	adjustsFontSizeToFit: true,
	minimumFontScale: 0.5
})`
	font-weight: 700;
	letter-spacing: 2px;
	text-transform: uppercase;
	color: ${({ theme }) => theme.text.tertiary};
`;

export const MetaItem = styled.View`
	flex-direction: column;
	gap: 6px;
	min-width: 100px;
`;

export const Row = styled.View`
	flex-direction: row;
	flex-wrap: wrap;
	gap: 32px;
`;
