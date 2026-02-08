import styled from 'styled-components/native';
import { Text } from '@ui';

export const DateText = styled(Text).attrs({
	numberOfLines: 1,
	ellipsizeMode: 'tail',
	adjustsFontSizeToFit: true,
	minimumFontScale: 0.5
})`
	font-size: 14px;
	color: ${({ theme }) => theme.text.secondary};
`;

export const DateRow = styled.View`
	flex-direction: row;
	align-items: center;
	gap: 6px;
`;

export const Name = styled(Text).attrs({
	numberOfLines: 1,
	ellipsizeMode: 'tail',
	adjustsFontSizeToFit: true,
	minimumFontScale: 0.5
})`
	font-size: 22px;
	font-weight: 700;
`;

export const Info = styled.View`
	flex: 1;
	flex-direction: column;
	gap: 4px;
`;

export default styled.View`
	flex-direction: row;
	align-items: center;
	gap: 16px;
`;
