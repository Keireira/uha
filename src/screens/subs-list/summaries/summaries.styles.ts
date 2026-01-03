import styled from 'styled-components/native';
import Animated from 'react-native-reanimated';

export const CategoryChip = styled.View<{ $color: string }>`
	display: flex;
	background-color: ${({ $color }) => $color};
`;

export const CategoryChips = styled(Animated.View)`
	display: flex;
	flex-direction: row;
	flex: 1;
	min-width: 100%;
	min-height: 16px;
	max-height: 16px;
	border-radius: 16px;
	overflow: hidden;
	margin-top: 8px;
`;

export const SummaryItem = styled(Animated.View)`
	display: flex;
	flex: 1;
	gap: 4px;
	padding: 12px;
	padding-bottom: 28px;
	flex-direction: column;
	background-color: #fff;
	border-radius: 16px;
	box-shadow: 0 0 5px #333;
	shadow-opacity: 0.1;
`;

export default styled.View`
	padding-horizontal: 16px;
	flex-direction: row;
	gap: 16px;
`;
