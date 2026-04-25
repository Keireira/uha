import styled from 'styled-components/native';
import { withAlpha } from '@lib/colors';

export const Label = styled.Text`
	flex: 1;

	font-size: 16px;
	font-weight: 500;

	color: ${({ theme }) => theme.text.primary};
`;

export const Value = styled.View`
	flex-direction: row;
	align-items: center;
	gap: 6px;
`;

export const ValueText = styled.Text`
	font-size: 15px;
	font-weight: 500;

	color: ${({ theme }) => theme.text.secondary};
`;

export default styled.Pressable<{ $isLast: boolean }>`
	flex-direction: row;
	align-items: center;
	justify-content: space-between;

	padding: 14px 16px;
	gap: 12px;

	border-bottom-width: ${({ $isLast }) => ($isLast ? 0 : 1)}px;
	border-bottom-color: ${({ theme }) => withAlpha(theme.text.tertiary, 0.18)};
`;
