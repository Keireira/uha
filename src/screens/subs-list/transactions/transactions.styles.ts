import styled from 'styled-components/native';

export const GroupedListContainer = styled.View`
	flex: 1;
	border-radius: 10px;
	overflow: hidden;
`;

export const BottomSpacer = styled.View<{ $bottom: number }>`
	height: ${({ $bottom }) => $bottom + 64}px;
`;

export const ItemSeparator = styled.View`
	height: 16px;
`;

export default styled.View`
	flex: 1;
	flex-direction: column;
	gap: 16px;
`;
