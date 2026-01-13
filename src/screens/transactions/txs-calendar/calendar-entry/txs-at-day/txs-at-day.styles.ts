import styled from 'styled-components/native';

export const EmptyView = styled.View`
	display: flex;
	align-items: center;
	justify-content: center;
	flex: 1;
`;

export default styled.View`
	display: flex;
	flex-direction: column;
	gap: 16px;

	margin-top: 32px;
	margin-bottom: 64px;
	margin-horizontal: -12px;
`;
