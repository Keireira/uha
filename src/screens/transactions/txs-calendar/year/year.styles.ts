import styled from 'styled-components/native';

export const BottomSpacer = styled.View<{ $height: number }>`
	height: ${({ $height }) => $height + 64}px;
`;

export default styled.View`
	flex: 1;
	flex-direction: column;
	gap: 16px;
`;
