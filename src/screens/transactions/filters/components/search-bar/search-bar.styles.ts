import styled from 'styled-components/native';
import type { EdgeInsets } from 'react-native-safe-area-context';

export default styled.View<{ $insets: EdgeInsets }>`
	position: absolute;
	bottom: 0;
	left: 0;
	right: 0;
	z-index: 20;
	height: ${({ $insets }) => $insets.bottom + 96}px;

	display: flex;
	align-items: center;
	justify-content: center;
`;
