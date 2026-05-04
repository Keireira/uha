import styled from 'styled-components/native';

export const RowDivider = styled.View`
	height: 0.5px;
	background-color: ${({ theme }) => `${theme.border.default}35`};
	margin-left: 72px;
`;

export const Info = styled.View`
	flex: 1;
	gap: 2px;
`;

export default styled.Pressable`
	flex-direction: row;
	align-items: center;
	gap: 14px;
	padding: 14px;
`;
