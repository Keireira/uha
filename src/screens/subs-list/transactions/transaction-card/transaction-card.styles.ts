import styled from 'styled-components/native';

export const LogoWrap = styled.View`
	display: flex;
	align-items: center;
	justify-content: center;
`;

export const TextWrap = styled.View`
	display: flex;
	flex-grow: 1;
	flex-direction: column;
	gap: 4px;
`;

export const TextRow = styled.View`
	display: flex;
	flex-direction: row;
	justify-content: space-between;
`;

export default styled.View`
	display: flex;
	flex-direction: row;

	gap: 16px;
	width: calc(100% + 24px);
	margin-right: -12px;
	margin-left: -12px;
	padding: 12px 16px;
	border-radius: 18px;
`;
