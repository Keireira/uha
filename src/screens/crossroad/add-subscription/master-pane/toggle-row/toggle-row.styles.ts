import styled from 'styled-components/native';
import { withAlpha } from '@lib/colors';

export default styled.View<{ $isLast: boolean }>`
	justify-content: center;

	padding: 8px 16px;
	min-height: 52px;

	border-bottom-width: ${({ $isLast }) => ($isLast ? 0 : 1)}px;
	border-bottom-color: ${({ theme }) => withAlpha(theme.text.tertiary, 0.18)};
`;
