import styled from 'styled-components/native';
import { Text, LargeText } from '@ui';

export const ConvertedPrice = styled(LargeText).attrs({
	numberOfLines: 1,
	adjustsFontSizeToFit: true,
	minimumFontScale: 0.5
})`
	font-weight: 500;
	color: ${({ theme }) => (theme.tint === 'dark' ? theme.text.secondary : theme.text.tertiary)};

	margin-top: 6px;
`;

export const BasePrice = styled(Text).attrs({
	numberOfLines: 1,
	adjustsFontSizeToFit: true,
	minimumFontScale: 0.5
})`
	font-size: 38px;
	line-height: 44px;
	font-weight: 800;
`;

export default styled.View<{ $withConversion: boolean }>`
	flex-direction: column;
	align-items: flex-start;

	margin-bottom: ${({ $withConversion }) => ($withConversion ? 12 : 0)}px;
`;
