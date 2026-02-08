import styled from 'styled-components/native';
import { Text } from '@ui';

export const GridItem = styled.View<{ $width: number }>`
	width: ${({ $width }) => $width}px;
`;

export const SectionHeader = styled.View`
	width: 100%;
	flex-direction: row;
	align-items: center;
	gap: 10px;
	padding-top: 16px;
	padding-bottom: 4px;
`;

export const SectionLetter = styled(Text)`
	font-size: 14px;
	font-weight: 800;
	color: ${({ theme }) => theme.text.tertiary};
	letter-spacing: 1px;
`;

export const SectionRule = styled.View`
	flex: 1;
	height: 0.5px;
	background-color: ${({ theme }) => `${theme.border.default}25`};
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
