import styled from 'styled-components/native';

export const GroupedListContainer = styled.View`
	flex: 1;
	border-radius: 10px;
	overflow: hidden;
`;

export const GroupedListItem = styled.View`
	min-height: 44px;
	flex: 1;
`;

export const BottomSpacer = styled.View<{ $bottom: number }>`
	height: ${({ $bottom }) => $bottom + 64}px;
`;

export default styled.View`
	flex-direction: column;
	margin-horizontal: 12px;
	gap: 16px;
`;
