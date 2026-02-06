import styled from 'styled-components/native';
import { Text } from '@ui';

export const GridItem = styled.View<{ $width: number }>`
	width: ${({ $width }) => $width}px;
`;

export const EmptyText = styled(Text)`
	font-size: 13px;
	font-weight: 500;
	color: ${({ theme }) => theme.text.tertiary};
	text-align: center;
	padding: 32px 0;
	letter-spacing: 0.5px;
`;

export default styled.View`
	flex-direction: row;
	flex-wrap: wrap;
	gap: 8px;
`;
