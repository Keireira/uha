import styled from 'styled-components/native';

export default styled.View<{ $top: number }>`
	flex: 1;
	background-color: ${({ theme }) => theme.background.default};
	padding-top: ${({ $top }) => $top}px;
`;
