import styled from 'styled-components/native';
import { withAlpha } from '@lib/colors';

export const Label = styled.Text`
	flex: 1;

	font-family: 'Nunito';
	font-size: 16px;
	font-weight: 500;

	color: ${({ theme }) => theme.text.primary};
`;

export default styled.Pressable<{ $isLast: boolean }>`
	flex-direction: row;
	align-items: center;
	justify-content: space-between;

	padding: 8px 16px;
	gap: 12px;

	min-height: 52px;

	border-bottom-width: ${({ $isLast }) => ($isLast ? 0 : 1)}px;
	border-bottom-color: ${({ theme }) => withAlpha(theme.text.tertiary, 0.18)};
`;
