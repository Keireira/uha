import styled from 'styled-components/native';
import { withAlpha } from '@lib/colors';

export const FromTimelineBanner = styled.View<{ $accent: string }>`
	flex-direction: row;
	align-items: center;
	gap: 10px;

	padding: 12px 14px;
	margin: 0 16px 8px;

	border-radius: 12px;
	background-color: ${({ $accent }) => withAlpha($accent, 0.12)};
`;

export const BannerTextBlock = styled.View`
	flex: 1;
	gap: 2px;
`;

export const BannerTitle = styled.Text<{ $accent: string }>`
	font-family: 'Nunito';
	font-size: 13px;
	font-weight: 700;

	color: ${({ $accent }) => $accent};
`;

export const BannerDescription = styled.Text`
	font-family: 'Nunito';
	font-size: 12px;
	font-weight: 500;
	line-height: 16px;

	color: ${({ theme }) => theme.text.secondary};
`;

export default styled.View`
	padding: 16px;

	background-color: ${({ theme }) => theme.background.secondary};
`;
