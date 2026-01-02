import styled from 'styled-components/native';

export const TextRow = styled.View`
	flex-direction: row;
	justify-content: space-between;
	gap: 16px;
`;

export const CategoryChip = styled.View<{ $color: string; $percentage: number }>`
	display: flex;
	background-color: ${({ $color }) => $color};
	height: 16px;
	width: ${({ $percentage }) => `${$percentage}%`};
`;

export const CategoryChips = styled.View`
	display: flex;
	flex-direction: row;
	flex: 1;
	min-width: 100%;
	min-height: 16px;
	border-radius: 16px;
	overflow: hidden;
`;

export const SummaryItem = styled.View`
	display: flex;
	flex: 1;
	flex-direction: column;
	gap: 8px;
	padding: 12px;
	padding-bottom: 28px;
	background-color: #fff;
	margin-left: -8px;
	border-radius: 16px;
	box-shadow: 0 0 5px #333;
	shadow-opacity: 0.1;
`;

export default styled.View`
	padding-horizontal: 16px;
	flex-direction: row;
	justify-content: space-between;
	gap: 16px;
`;
