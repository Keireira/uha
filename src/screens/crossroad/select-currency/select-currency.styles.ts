import styled from 'styled-components/native';
import { BaseText, Text, SmallText } from '@ui';

export const Container = styled.View`
	flex: 1;
	background-color: ${({ theme }) => theme.background.default};
`;

export const Header = styled.View`
	flex-direction: row;
	align-items: center;
	justify-content: space-between;
	padding: 16px 24px 12px;
`;

export const Title = styled(BaseText)`
	font-size: 22px;
	font-weight: 700;
	color: ${({ theme }) => theme.text.primary};
`;

export const SearchContainer = styled.View`
	padding: 0 24px 12px;
`;

export const SectionHeaderText = styled(SmallText)`
	font-weight: 600;
	color: ${({ theme }) => theme.text.secondary};
	text-transform: uppercase;
	letter-spacing: 0.5px;
	padding: 16px 24px 6px;
`;

export const CurrencyRow = styled.Pressable`
	flex-direction: row;
	align-items: center;
	padding: 12px 24px;
	gap: 14px;
`;

export const CurrencyInfo = styled.View`
	flex: 1;
	gap: 2px;
`;

export const CurrencyName = styled(Text)`
	font-size: 16px;
`;

export const CurrencyCode = styled(SmallText)`
	color: ${({ theme }) => theme.text.secondary};
`;

export const Separator = styled.View`
	height: 0.5px;
	margin-left: 38px;
	background-color: ${({ theme }) => `${theme.border.default}50`};
`;
