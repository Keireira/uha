import styled from 'styled-components/native';

import { Text } from '@ui';
import Animated from 'react-native-reanimated';

export const DateText = styled(Text)`
	color: ${({ theme }) => theme.text.secondary};
`;

export const CategoryChip = styled.View<{ $color: string }>`
	display: flex;
	background-color: ${({ $color }) => $color};
`;

export const CategoryChips = styled(Animated.View)`
	display: flex;
	flex-direction: row;
	flex: 1;
	min-width: 100%;
	min-height: 12px;
	max-height: 12px;
	border-radius: 12px;
	overflow: hidden;
	margin-top: 8px;
`;

export default styled(Animated.View)<{ $isDisabled: boolean }>`
	display: flex;
	flex: 1;
	gap: 4px;
	padding: 12px;
	padding-bottom: 28px;
	flex-direction: column;
	background-color: ${({ theme }) => theme.surface.default};
	border-radius: 16px;
	box-shadow: 0 0 2px ${({ theme }) => theme.shadow.default};
	shadow-opacity: 0.1;
	opacity: ${({ $isDisabled }) => ($isDisabled ? 0.444 : 1)};
	transition: opacity 166ms linear;
`;
