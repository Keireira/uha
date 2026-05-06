import styled from 'styled-components/native';
import { withAlpha } from '@lib/colors';

export const ErrorTextBlock = styled.View`
	flex: 1;
	gap: 2px;
`;

export const ErrorLine = styled.Text`
	font-size: 13px;
	font-weight: 500;
	line-height: 17px;

	color: ${({ theme }) => theme.semantic.error};
`;

export default styled.View`
	flex-direction: row;
	align-items: flex-start;
	gap: 10px;

	padding: 12px 14px;
	margin-top: 10px;
	margin-horizontal: 16px;

	border-radius: 12px;
	background-color: ${({ theme }) => withAlpha(theme.semantic.error, 0.12)};
`;
