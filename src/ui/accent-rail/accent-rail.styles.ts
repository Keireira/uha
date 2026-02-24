import styled from 'styled-components/native';

import type { SegmentT } from './accent-rail.d';

export const AccentBlock = styled.View<{ $color: SegmentT['color']; $flex: SegmentT['flex'] }>`
	flex: ${({ $flex }) => $flex ?? 1};
	border-radius: 3px;
	background-color: ${({ $color, theme }) => $color || theme.accent.orange};
`;

export default styled.View`
	width: 6px;
	gap: 3px;
	margin-right: 24px;
`;
