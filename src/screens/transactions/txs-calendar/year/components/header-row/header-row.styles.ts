import styled from 'styled-components/native';

export default styled.View`
	margin-bottom: 18px;
	margin-horizontal: 16px;
	padding-bottom: 6px;
	border-bottom-width: 1px;
	border-bottom-color: ${({ theme }) => `${theme.border.default}75`};
`;
