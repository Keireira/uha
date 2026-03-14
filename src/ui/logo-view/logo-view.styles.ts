import styled from 'styled-components/native';
import { Text } from '../typography';

export const Emoji = styled(Text)`
	font-size: 24px;
`;

export default styled.View<{ $color: string }>`
	width: 100%;
	height: 100%;
	display: flex;
	align-items: center;
	justify-content: center;

	background-color: ${({ $color }) => `${$color}30`};
`;
